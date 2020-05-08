import bcryptjs from 'bcryptjs';
import queryString from 'query-string';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wechat, MiniProgram, OAuth } from 'wechat-jssdk';

import { Auth } from '@leaa/common/src/entrys';
import { authConfig } from '@leaa/api/src/configs';
import { IWechatInfo, ICreateAuthAndUserResult, IRequest, IResponse } from '@leaa/api/src/interfaces';
import { CreateAuthInput } from '@leaa/common/src/dtos/auth';
import { logger, randomString, msgError } from '@leaa/api/src/utils';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';

import { AuthService } from './auth.service';

const CLS_NAME = 'AuthWechatService';
const PLATFORM_NAME = 'wechat';

@Injectable()
export class AuthWechatService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  // prettier-ignore
  // eslint-disable-next-line max-len
  private checkMiniProgramConfig = () => authConfig.wechat.miniProgram && authConfig.wechat.miniProgram.appId && authConfig.wechat.miniProgram.appSecret;
  private checkWechatConfig = () => authConfig.wechat.appId && authConfig.wechat.appSecret;

  private wechat = this.checkWechatConfig() && new Wechat(authConfig.wechat);
  private wechatOAuth = this.checkWechatConfig() && new OAuth(authConfig.wechat);
  private miniProgram = this.checkMiniProgramConfig() && new MiniProgram(authConfig.wechat);
  private nextTicket = { ticket: randomString(), ticket_at: new Date() };

  async verifySignature(req: IRequest): Promise<string | null> {
    const signature = await this.wechat.jssdk.verifySignature(req.query);

    if (signature) {
      return req.query.echostr;
    }

    return 'NOT-SIGNATURE-ECHOSTR';
  }

  async getMiniProgramSession(req: IRequest, body: { code: string }): Promise<string | null> {
    if (body.code) {
      return this.miniProgram.getSession(body.code);
    }

    return 'NOT-SESSION';
  }

  async wechatDecryptData(
    req: IRequest,
    body: { encryptedData: string; iv: string; sessionKey: string; platform: string },
  ): Promise<any | string> {
    if (body.encryptedData && body.iv && body.sessionKey) {
      return this.miniProgram.decryptData(body.encryptedData, body.iv, body.sessionKey);

      // return this.createUserAndAuth(body.platform, decryptData);
      // return decryptData;
    }

    return 'DECRYPT-ERROR';
  }

  async createUserAndAuth(platform: string, profile: IWechatInfo): Promise<ICreateAuthAndUserResult> {
    const newUser = await this.userService.createUser({
      email: `${platform}-${new Date().valueOf()}@local.com`,
      password: bcryptjs.hashSync(this.nextTicket.ticket),
      name: profile.nickname,
      status: 1,
      is_admin: 0,
      avatar_url: profile.headimgurl,
    });

    const newAuthData: CreateAuthInput = {
      open_id: profile.openid,
      app_id: this.configService.OAUTH_WECHAT_APP_ID,
      user_id: newUser?.id || undefined,
      platform,
      nickname: profile.nickname,
      sex: profile.sex,
      country: profile.country,
      province: profile.province,
      city: profile.city,
      avatar_url: profile.headimgurl,
      last_auth_at: new Date(),
      ...this.nextTicket,
    };

    const newAuth = await this.authService.createAuth(newAuthData);

    return { newUser, newAuth };
  }

  async wechatLogin(req: IRequest, res: IResponse): Promise<void> {
    const { jumpUrl, scope } = req.query;

    const stateParams: { jumpUrl: string } = {
      jumpUrl: encodeURI(jumpUrl),
    };

    const nextScope = ['snsapi_base', 'snsapi_userinfo'].includes(scope) ? scope : 'snsapi_base';
    const nextStateParams = JSON.stringify(stateParams);

    // eslint-disable-next-line max-len
    const url = `/get-weixin-code.html?appid=${authConfig.wechat.appId}&scope=${nextScope}&state=${nextStateParams}&redirect_uri=${authConfig.wechat.wechatRedirectUrl}`;

    logger.log(`Wechat Login URL, ${url}`, CLS_NAME);

    res.redirect(url);
  }

  async wechatCallback(req: IRequest, res: IResponse): Promise<void | string> {
    if (!req.query.state || !req.query.code) {
      msgError({ text: 'Wechat Callback Error' });
    }

    const { jumpUrl } = JSON.parse(decodeURIComponent(req.query.state));
    const { url, query } = queryString.parseUrl(jumpUrl);

    if (!query || !query.platform || !['wechat', 'weibo'].includes(query.platform as string)) {
      msgError({ text: 'Wechat Callback Invalid Platform' });
    }

    const platform = (query.platform as string) || PLATFORM_NAME;

    // find Auth
    //  |
    // Not-Auth
    //     | --> save Auth --> return [ticket]
    //                          | --> Sign Up and Binding --> DONE!
    // Has-Auth
    //     | --> return [ticket] --> client get [ticket] --> POST [ticket] exchange [jwt] token --> DONE!

    const wechatInfo: IWechatInfo = await this.wechatOAuth.getUserInfo(req.query.code);

    let userAuth: Auth | undefined;

    try {
      const hasAuth = await this.authService.authByOpenId(wechatInfo.openid, platform);

      if (hasAuth) {
        await this.authRepository.update(hasAuth.id, this.nextTicket);

        userAuth = { ...hasAuth, ...this.nextTicket };
      } else {
        const { newAuth } = await this.createUserAndAuth(platform, wechatInfo);

        userAuth = newAuth;
      }

      logger.log(`Wechat Callback Auth, ${JSON.stringify(userAuth)}`, CLS_NAME);
    } catch (err) {
      logger.error('Wechat Callback Error', CLS_NAME, err);
    }

    let nextQuery = query;

    if (userAuth?.ticket) {
      nextQuery = { ...query, ticket: userAuth?.ticket };
    }

    const redirectUrl = `${url}?${queryString.stringify(nextQuery)}`;

    logger.log(`Wechat Redirect URL, ${redirectUrl}`, CLS_NAME);

    res.redirect(redirectUrl);
  }
}
