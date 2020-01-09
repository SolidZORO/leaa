import uuid from 'uuid';
import moment from 'moment';
import queryString from 'query-string';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wechat, MiniProgram, OAuth } from 'wechat-jssdk';

import { User, Oauth } from '@leaa/common/src/entrys';
import { oauthConfig } from '@leaa/api/src/configs';
import { IWechatDecryptUserInfo } from '@leaa/api/src/interfaces';
import { CreateOauthInput } from '@leaa/common/src/dtos/oauth';
import { errorUtil } from '@leaa/api/src/utils';

const CLS_NAME = 'OauthWechatService';

@Injectable()
export class OauthWechatService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Oauth) private readonly oauthRepository: Repository<Oauth>,
  ) {}

  // prettier-ignore
  // eslint-disable-next-line max-len
  private checkMiniProgramConfig = () => oauthConfig.wechat.miniProgram && oauthConfig.wechat.miniProgram.appId && oauthConfig.wechat.miniProgram.appSecret;
  private checkWechatConfig = () => oauthConfig.wechat.appId && oauthConfig.wechat.appSecret;

  private wechat = this.checkWechatConfig() && new Wechat(oauthConfig.wechat);
  private wechatOAuth = this.checkWechatConfig() && new OAuth(oauthConfig.wechat);
  private miniProgram = this.checkMiniProgramConfig() && new MiniProgram(oauthConfig.wechat);

  async bindUserIdToOauth(user: User, oid: number): Promise<any> {
    if (!oid || typeof Number(oid) !== 'number') return errorUtil.ERROR({ error: `Nout Found oid ${oid}`, user });

    const oauth = await this.oauthRepository.findOne({ id: Number(oid) });
    if (!oauth) return errorUtil.ERROR({ error: `Not Found Oauth ${oid}`, user });

    const result = await this.oauthRepository.update(Number(oid), { user_id: user.id });
    if (!result) return errorUtil.ERROR({ error: `Binding ${oid} Failed`, user });

    return result;
  }

  async clearTicket(oauthId: number): Promise<void> {
    await this.oauthRepository.update(oauthId, { ticket: null, ticket_at: '' });
  }

  async getUserByTicket(ticket: string): Promise<User> {
    if (!ticket) return errorUtil.ERROR({ error: 'Not Found Ticket' });

    const oauth = await this.oauthRepository.findOne({ ticket });
    if (!oauth) return errorUtil.ERROR({ error: 'Not Found Oauth' });

    const user = await this.userRepository.findOne({ id: oauth.user_id });
    if (!user) return errorUtil.ERROR({ error: 'Not Found User' });

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

  async getMiniProgramSession(req: Request, body: { code: string }): Promise<string | null> {
    if (body.code) {
      return this.miniProgram.getSession(body.code);
    }

    return 'NOT-SESSION';
  }

  async wechatDecryptData(
    req: Request,
    body: { encryptedData: string; iv: string; sessionKey: string; platform: string },
  ): Promise<any | string> {
    if (body.encryptedData && body.iv && body.sessionKey) {
      const decryptData = await this.miniProgram.decryptData(body.encryptedData, body.iv, body.sessionKey);

      return this.getOrCreateOauth(body.platform, decryptData);
      // return decryptData;
    }

    return 'DECRYPT-ERROR';
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

  async getOauthByOpenId(openId: string): Promise<Oauth | undefined> {
    return this.oauthRepository.findOne({ open_id: openId });
  }

  async getOrCreateOauth(platform: string, oauthInput: IWechatDecryptUserInfo): Promise<Oauth | undefined> {
    const oauth = await this.getOauthByOpenId(oauthInput.openId);

    if (oauth) {
      return oauth;
    }

    const nextOauthInput = {
      app_id: oauthInput.watermark.appid,
      open_id: oauthInput.openId,
      platform,
      nickname: oauthInput.nickName,
      sex: oauthInput.gender,
      city: oauthInput.city,
      province: oauthInput.province,
      country: oauthInput.country,
      avatar_url: oauthInput.avatarUrl,
      last_oauth_at: new Date(),
      // ticket: uuid.v4(),
      // ticket_at: new Date(),
      ticket: '',
      ticket_at: '',
    };

    return this.oauthRepository.save(nextOauthInput);
  }

  async wechatCallback(req: Request, res: Response): Promise<void | string> {
    if (!req.query.state || !req.query.code) {
      errorUtil.ERROR({ error: 'Wechat Callback Error' });
    }

    const { jumpUrl } = JSON.parse(decodeURIComponent(req.query.state));
    const { url, query } = queryString.parseUrl(jumpUrl);

    if (!query || !query.platform || !['wechat', 'weibo'].includes(query.platform as string)) {
      errorUtil.ERROR({ error: 'Wechat Callback Invalid Platform' });
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

    const oauth = await this.oauthRepository.findOne({ open_id: wechatInfo.openid });

    let oid = '';
    let otk = ''; // Tips: `otk` Avoid wechat keyword `ticket` conflicts

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

        res.redirect(url);

        errorUtil.ERROR({ error: 'Wechat Callback Ticket Expired' });
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
