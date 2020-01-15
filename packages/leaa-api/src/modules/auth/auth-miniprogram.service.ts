import bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Auth, User } from '@leaa/common/src/entrys';
import { ICreateAuthAndUserResult, IMiniprogramCloudFnResult } from '@leaa/api/src/interfaces';
import { CreateAuthInput } from '@leaa/common/src/dtos/auth';
import { loggerUtil, stringUtil } from '@leaa/api/src/utils';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';

import { AuthService } from './auth.service';

const CLS_NAME = 'AuthMiniprogramService';
const PLATFORM_NAME = 'miniprogram';

@Injectable()
export class AuthMiniprogramService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  private nextTicket = { ticket: stringUtil.random(), ticket_at: new Date() };

  async createUserAndAuth(platform: string, data: IMiniprogramCloudFnResult): Promise<ICreateAuthAndUserResult> {
    const newUser = await this.userService.createUser({
      email: `${platform}-${new Date().valueOf()}@local.com`,
      password: bcryptjs.hashSync(this.nextTicket.ticket),
      name: data.user.userInfo.nickName,
      status: 1,
      is_admin: 0,
      avatar_url: data.user.userInfo.avatarUrl,
    });

    const newAuthData: CreateAuthInput = {
      open_id: data.auth.OPENID,
      app_id: this.configService.OAUTH_WECHAT_MINIPROGRAM_APP_ID,
      user_id: newUser?.id || undefined,
      platform,
      nickname: data.user.userInfo.nickName,
      sex: data.user.userInfo.gender,
      country: data.user.userInfo.country,
      province: data.user.userInfo.province,
      city: data.user.userInfo.city,
      avatar_url: data.user.userInfo.avatarUrl,
      last_auth_at: new Date(),
      // ...this.nextTicket,
    };

    const newAuth = await this.authService.createAuth(newAuthData);

    return { newUser, newAuth };
  }

  async miniprogramLogin(data: IMiniprogramCloudFnResult): Promise<User | void> {
    const platform = PLATFORM_NAME;

    let userInfo: User | undefined;
    let userAuth: Auth | undefined;

    try {
      const hasAuth = await this.authService.authByOpenId(data.auth.OPENID, platform);

      if (hasAuth) {
        userInfo = await this.userService.user(Number(hasAuth?.user_id));
        userAuth = { ...hasAuth };
      } else {
        const { newAuth, newUser } = await this.createUserAndAuth(platform, data);

        userInfo = newUser;
        userAuth = newAuth;
      }

      loggerUtil.log(`Miniprogram Login Auth, ${JSON.stringify(userAuth)}`, CLS_NAME);
    } catch (err) {
      loggerUtil.error('Miniprogram Login Error', CLS_NAME, err);
    }

    if (userInfo) {
      return this.authService.addTokenToUser(userInfo);
    }

    return userInfo;
  }
}
