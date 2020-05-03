import bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-github';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Auth } from '@leaa/common/src/entrys';
import { IRequest, IResponse, IRequestGithubCallback, ICreateAuthAndUserResult } from '@leaa/api/src/interfaces';
import { CreateAuthInput } from '@leaa/common/src/dtos/auth';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { loggerUtil, stringUtil } from '@leaa/api/src/utils';

const CLS_NAME = 'AuthGithubService';
const PLATFORM_NAME = 'github';

@Injectable()
export class AuthGithubService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  private nextTicket = { ticket: stringUtil.random(), ticket_at: new Date() };

  async createUserAndAuth(req: IRequest, profile: Profile): Promise<ICreateAuthAndUserResult> {
    const newUser = await this.userService.createUser({
      email: `${PLATFORM_NAME}-${new Date().valueOf()}@local.com`,
      password: bcryptjs.hashSync(this.nextTicket.ticket),
      name: profile.displayName,
      status: 1,
      is_admin: 0,
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
      avatar_url: profile._json && profile._json.avatar_url,
    });

    const newAuthData: CreateAuthInput = {
      open_id: profile.id,
      app_id: this.configService.OAUTH_GITHUB_CLIENT_ID,
      user_id: newUser?.id || undefined,
      platform: PLATFORM_NAME,
      nickname: profile.displayName,
      sex: 0,
      country: '',
      province: '',
      city: '',
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
      avatar_url: profile._json && profile._json.avatar_url,
      last_auth_at: new Date(),
      ...this.nextTicket,
    };

    const newAuth = await this.authService.createAuth(newAuthData);

    return { newUser, newAuth };
  }

  async githubValidate(req: IRequest, accessToken: string, refreshToken: string, profile: Profile, done: any) {
    console.log(profile);

    let userInfo: User | undefined;
    let userAuth: Auth | undefined;

    try {
      const hasAuth = await this.authService.authByOpenId(profile.id, PLATFORM_NAME);

      if (hasAuth) {
        await this.authRepository.update(hasAuth.id, this.nextTicket);

        userInfo = await this.userService.user(hasAuth?.user_id);
        userAuth = { ...hasAuth, ...this.nextTicket };
      } else {
        const { newUser, newAuth } = await this.createUserAndAuth(req, profile);

        userInfo = newUser;
        userAuth = newAuth;
      }

      await done(null, {
        userInfo,
        userAuth,
      });
    } catch (err) {
      loggerUtil.error(`Github Validate, ${JSON.stringify(err)}`, CLS_NAME, err);
      done(err, false);
    }
  }

  async githubCallback(req: IRequestGithubCallback, res: IResponse): Promise<void | string> {
    const url = `${req.headers.referer}login?ticket=${req.user?.userAuth?.ticket}`;

    loggerUtil.log(`Github Callback URL, ${url}`, CLS_NAME);

    res.redirect(url);
  }
}
