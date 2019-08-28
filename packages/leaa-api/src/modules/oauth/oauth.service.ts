import moment from 'moment';
import queryString from 'query-string';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// @ts-ignore
import { Wechat, MiniProgram, OAuth } from 'wechat-jssdk';

import { User, Oauth } from '@leaa/common/src/entrys';
import { oauthConfig } from '@leaa/api/src/configs';
import { CreateOauthInput } from '@leaa/common/src/dtos/oauth';
import { loggerUtil } from '@leaa/api/src/utils';
import uuid from 'uuid';

const CONSTRUCTOR_NAME = 'OauthService';

@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Oauth) private readonly oauthRepository: Repository<Oauth>,
  ) {}

  private miniProgram = new MiniProgram(oauthConfig.wechat);
  private wechat = new Wechat(oauthConfig.wechat);
  private wechatOAuth = new OAuth(oauthConfig.wechat);

  async bindUserIdToOauth(user: User, oid: number): Promise<any> {
    if (!oid || typeof Number(oid) !== 'number') {
      const message = `oid ${oid} error`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    const oauth = await this.oauthRepository.findOne({ id: Number(oid) });

    if (!oauth) {
      const message = `oauth ${oid} does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    const result = await this.oauthRepository.update(Number(oid), { user_id: user.id });

    if (!result) {
      const message = `oauth ${oid} does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    return result;
  }

  async clearTicket(oauthId: number): Promise<void> {
    await this.oauthRepository.update(oauthId, { ticket: '', ticket_at: '' });
  }

  async getUserByTicket(ticket: string): Promise<User> {
    if (!ticket) {
      const message = `ticket error`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    const oauth = await this.oauthRepository.findOne({ ticket });

    if (!oauth) {
      const message = `oauth does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    const user = await this.userRepository.findOne({ id: oauth.user_id });

    if (!user) {
      const message = `user does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    await this.clearTicket(oauth.id);

    return user;
  }

  async verifySignature(req: Request): Promise<string | null> {
    const signature = await this.wechat.jssdk.verifySignature(req.query);

    if (signature) {
      return req.query.echostr;
    }

    return 'NOT-SIGNATURE-ECHOSTR';
  }

  async getMiniProgramSession(req: Request): Promise<string | null> {
    if (req.query.code) {
      return this.miniProgram.getSession(req.query.code);
    }

    return 'NOT-SESSION';
  }

  async wechatLogin(req: Request, res: Response): Promise<void> {
    const { jumpUrl, scope } = req.query;

    const stateParams: { jumpUrl: string } = {
      jumpUrl: encodeURI(jumpUrl),
    };

    const nextScope = ['snsapi_base', 'snsapi_userinfo'].includes(scope) ? scope : 'snsapi_base';
    const nextStateParams = JSON.stringify(stateParams);

    // eslint-disable-next-line max-len
    const url = `/get-weixin-code.html?appid=${oauthConfig.wechat.appId}&scope=${nextScope}&state=${nextStateParams}&redirect_uri=${oauthConfig.wechat.wechatRedirectUrl}`;

    res.redirect(url);
  }

  async wechatCallback(req: Request, res: Response): Promise<void | string> {
    if (!req.query.state || !req.query.code) {
      const message = `wechat callback error`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    const { jumpUrl } = JSON.parse(decodeURIComponent(req.query.state));
    const { url, query } = queryString.parseUrl(jumpUrl);

    if (!query || !query.platform || !['wechat', 'weibo'].includes(query.platform as string)) {
      const message = `wechat callback invalid platform`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    const wechatInfo = await this.wechatOAuth.getUserInfo(req.query.code);

    const oauthInput: CreateOauthInput = {
      app_id: oauthConfig.wechat.appId,
      open_id: wechatInfo.openid,
      platform: query.platform as string,
      nickname: wechatInfo.nickname,
      sex: wechatInfo.sex,
      city: wechatInfo.city,
      province: wechatInfo.province,
      country: wechatInfo.country,
      avatar_url: wechatInfo.headimgurl,
      last_oauth_at: new Date(),
      ticket: uuid.v4(),
      ticket_at: new Date(),
    };

    let oid = '';
    let otk = ''; // Tips: `otk` Avoid wechat keyword `ticket` conflicts

    const oauth = await this.oauthRepository.findOne({ open_id: wechatInfo.openid });

    // find OAuth
    //  |
    // Not-OAuth
    //     | --> save OAuth --> return [oid]
    //                          | --> Sign Up (url include &oid=1234) --> POST and Binding --> DONE!
    //                          | --> close client --> WAITING NEXT...
    // Has-OAuth
    //     | --> return [ticket] --> client get [ticket] --> POST [ticket] exchange [jwt] token --> DONE!

    if (oauth && oauth.user_id) {
      if (
        oauth &&
        oauth.ticket_at &&
        // prettier-ignore
        moment(oauth.ticket_at).valueOf() - moment(new Date()).add(60, 'seconds').valueOf() <= 0
      ) {
        await this.clearTicket(oauth.id);

        const message = `wechat callback ticket expired`;

        loggerUtil.warn(message, CONSTRUCTOR_NAME);

        res.redirect(url);

        throw new Error(message);
      }

      const ticket = uuid.v4();
      await this.oauthRepository.update(oauth.id, { ticket });

      otk = ticket;
    } else if (oauth) {
      oid = String(oauth.id);
    } else {
      const newOauth = await this.oauthRepository.save(oauthInput);
      oid = String(newOauth.id);
    }

    delete query.platform;

    let nextQuery = query;

    if (otk) {
      nextQuery = { ...query, otk };
    } else if (oid) {
      nextQuery = { ...query, oid };
    }

    const redirectUrl = `${url}?${queryString.stringify(nextQuery)}`;

    res.redirect(redirectUrl);
  }
}
