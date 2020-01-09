import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github';

import { IRequest } from '@leaa/api/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { AuthGithubService } from '@leaa/api/src/modules/auth/auth-github.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService, private readonly authGithubService: AuthGithubService) {
    super({
      clientID: configService.OAUTH_GITHUB_CLIENT_ID,
      clientSecret: configService.OAUTH_GITHUB_CLIENT_SECRET,
      callbackURL: configService.OAUTH_GITHUB_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['user:email:location'],
    });
  }

  async validate(req: IRequest, accessToken: string, refreshToken: string, profile: Profile, done: any) {
    return this.authGithubService.githubValidate(req, accessToken, refreshToken, profile, done);
  }
}
