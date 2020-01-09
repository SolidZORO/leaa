import uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-github';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Auth } from '@leaa/common/src/entrys';
import { IRequest, IResponse, IRequestGithubCallback } from '@leaa/api/src/interfaces';
import { CreateAuthInput } from '@leaa/common/src/dtos/auth';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';

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

  async githubValidate(req: IRequest, accessToken: string, refreshToken: string, profile: Profile, done: any) {
    try {
      let userInfo: User | undefined;
      let userAuth: Auth | undefined;
      const hasAuth = await this.authService.authByOpenId(profile.id, PLATFORM_NAME);

      const newTicket = {
        ticket: uuid.v4(),
        ticket_at: new Date(),
      };

      if (hasAuth) {
        await this.authRepository.update(hasAuth.id, newTicket);

        userInfo = await this.userService.user(Number(hasAuth?.user_id));
        userAuth = { ...hasAuth, ...newTicket };
      } else {
        userInfo = await this.userService.createUser({
          email: `github-${new Date().valueOf()}@local.com`,
          password: accessToken,
          name: profile.displayName,
          status: 1,
          is_admin: 0,
          // @ts-ignore
          // eslint-disable-next-line no-underscore-dangle
          avatar_string: JSON.stringify({ external_url: profile._json && profile._json.avatar_url }),
        });

        const newAuth: CreateAuthInput = {
          open_id: profile.id,
          app_id: this.configService.OAUTH_GITHUB_CLIENT_ID,
          user_id: userInfo?.id,
          platform: PLATFORM_NAME,
          nickname: profile.displayName,
          sex: 0,
          city: '',
          province: '',
          country: '',
          // @ts-ignore
          // eslint-disable-next-line no-underscore-dangle
          avatar_url: profile._json && profile._json.avatar_url,
          last_auth_at: new Date(),
          ...newTicket,
        };

        userAuth = await this.authService.createAuth(newAuth);
      }

      await done(null, {
        userInfo,
        userAuth,
      });
    } catch (err) {
      done(err, false);
    }
  }

  async githubCallback(req: IRequestGithubCallback, res: IResponse): Promise<void | string> {
    res.redirect(`http://localhost:7777/login?ticket=${req.user?.userAuth?.ticket}`);
  }
}
