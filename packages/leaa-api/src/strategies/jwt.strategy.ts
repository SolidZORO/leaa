import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

import { IJwtPayload } from '@leaa/common/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { checkAvailableUser } from '@leaa/api/src/utils';

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

    return user && checkAvailableUser(user);
  }
}
