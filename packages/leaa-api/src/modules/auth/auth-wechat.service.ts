import uuid from 'uuid';
import moment from 'moment';
import queryString from 'query-string';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wechat, MiniProgram, OAuth } from 'wechat-jssdk';

import { Auth } from '@leaa/common/src/entrys';
import { authConfig } from '@leaa/api/src/configs';
import { IWechatDecryptUserInfo } from '@leaa/api/src/interfaces';
import { CreateAuthInput } from '@leaa/common/src/dtos/auth';
import { errorUtil } from '@leaa/api/src/utils';

import { AuthService } from './auth.service';

const CLS_NAME = 'AuthWechatService';

@Injectable()
export class AuthWechatService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly authService: AuthService,
  ) {}

  // prettier-ignore
  // eslint-disable-next-line max-len
  private checkMiniProgramConfig = () => authConfig.wechat.miniProgram && authConfig.wechat.miniProgram.appId && authConfig.wechat.miniProgram.appSecret;
  private checkWechatConfig = () => authConfig.wechat.appId && authConfig.wechat.appSecret;

  private wechat = this.checkWechatConfig() && new Wechat(authConfig.wechat);
  private wechatOAuth = this.checkWechatConfig() && new OAuth(authConfig.wechat);
  private miniProgram = this.checkMiniProgramConfig() && new MiniProgram(authConfig.wechat);

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

      return this.getOrCreateAuth(body.platform, decryptData);
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
    const url = `/get-weixin-code.html?appid=${authConfig.wechat.appId}&scope=${nextScope}&state=${nextStateParams}&redirect_uri=${authConfig.wechat.wechatRedirectUrl}`;

    res.redirect(url);
  }

  async getOrCreateAuth(platform: string, authInput: IWechatDecryptUserInfo): Promise<Auth | undefined> {
    const auth = await this.authService.auth(authInput.openId, 'wechat');

    if (auth) {
      return auth;
    }

    const nextAuthInput = {
      app_id: authInput.watermark.appid,
      open_id: authInput.openId,
      platform,
      nickname: authInput.nickName,
      sex: authInput.gender,
      city: authInput.city,
      province: authInput.province,
      country: authInput.country,
      avatar_url: authInput.avatarUrl,
      last_auth_at: new Date(),
      // ticket: uuid.v4(),
      // ticket_at: new Date(),
      ticket: '',
      ticket_at: '',
    };

    return this.authRepository.save(nextAuthInput);
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

    const authInput: CreateAuthInput = {
      app_id: authConfig.wechat.appId,
      open_id: wechatInfo.openid,
      platform: query.platform as string,
      nickname: wechatInfo.nickname,
      sex: wechatInfo.sex,
      city: wechatInfo.city,
      province: wechatInfo.province,
      country: wechatInfo.country,
      avatar_url: wechatInfo.headimgurl,
      last_auth_at: new Date(),
      ticket: uuid.v4(),
      ticket_at: new Date(),
    };

    const auth = await this.authRepository.findOne({ open_id: wechatInfo.openid });

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

    if (auth && auth.user_id) {
      if (
        auth &&
        auth.ticket_at &&
        // prettier-ignore
        moment(auth.ticket_at).valueOf() - moment(new Date()).add(60, 'seconds').valueOf() <= 0
      ) {
        await this.authService.clearTicket(auth.id);

        res.redirect(url);

        errorUtil.ERROR({ error: 'Wechat Callback Ticket Expired' });
      }

      const ticket = uuid.v4();
      await this.authRepository.update(auth.id, { ticket });

      otk = ticket;
    } else if (auth) {
      oid = String(auth.id);
    } else {
      const newAuth = await this.authRepository.save(authInput);
      oid = String(newAuth.id);
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
