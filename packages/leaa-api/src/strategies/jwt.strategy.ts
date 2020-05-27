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
        expiresIn: configService.SERVER_COOKIE_EXPIRES_SECOND * (60 * 60 * 24),
      },
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.authService.validateUserByPayload(payload);

    if (!user) return new UnauthorizedException();

    return checkUserIsEnable(user);
  }
}
