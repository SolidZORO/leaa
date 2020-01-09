import { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github';

import { Oauth, User } from '@leaa/common/src/entrys';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
// import { OService } from '@leaa/api/src/modules/oauth/oauth.service';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { OauthService } from '@leaa/api/src/modules/oauth/oauth.service';
import { CreateOauthInput } from '@leaa/common/src/dtos/oauth';
import { UserService } from '@leaa/api/src/modules/user/user.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly oauthService: OauthService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.OAUTH_GITHUB_CLIENT_ID,
      clientSecret: configService.OAUTH_GITHUB_CLIENT_SECRET,
      callbackURL: configService.OAUTH_GITHUB_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['user:email:location'],
    });
  }

  async validate(req: Request, accessToken: string, refreshToken: string, profile: Profile, done: any) {
    try {
      let user: User | undefined;
      let oauth: Oauth | undefined;
      const hasOauth = await this.oauthService.oauth(`${profile.id}`, 'github');

      if (hasOauth) {
        oauth = hasOauth;
        user = await this.userService.user(Number(hasOauth?.user_id));
      } else {
        user = await this.userService.createUser({
          email: `ramdown-${new Date().valueOf()}@leaa.com`,
          password: accessToken,
          name: profile.displayName,
          status: 1,
          is_admin: 0,
          // @ts-ignore
          // eslint-disable-next-line no-underscore-dangle
          avatar_string: JSON.stringify({ external_url: profile._json && profile._json.avatar_url }),
        });

        const newOauthData: CreateOauthInput = {
          open_id: profile.id,
          app_id: '0132c31f4fe38633c948',
          user_id: user?.id,
          platform: 'github',
          nickname: profile.displayName,
          sex: 0,
          city: '',
          province: '',
          country: '',
          // @ts-ignore
          // eslint-disable-next-line no-underscore-dangle
          avatar_url: profile._json && profile._json.avatar_url,
          last_oauth_at: new Date(),
        };

        oauth = await this.oauthService.createOauth(newOauthData);
      }

      done(null, {
        user,
        oauth,
      });
    } catch (err) {
      done(err, false);
    }
  }
}
