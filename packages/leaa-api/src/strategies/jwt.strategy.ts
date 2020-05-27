import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

import { IJwtPayload } from '@leaa/common/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';
import { AuthService } from '@leaa/api/src/modules/v1/auth/auth.service';
import { checkUserIsEnable } from '@leaa/api/src/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.JWT_SECRET_KEY,
      jsonWebTokenOptions: {
        // # (60 * 60 * 24) * 7d = 604800
        // # (60 * 60 * 24) * 30d = 2592000
        // # (60 * 60 * 24) * 180d = 15552000
        // Here is default value by .env, Can override
        expiresIn: configService.SERVER_COOKIE_EXPIRES_SECOND,
      },
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.authService.validateUserByPayload(payload);

    if (!user) return new UnauthorizedException();

    return checkUserIsEnable(user);
  }
}
