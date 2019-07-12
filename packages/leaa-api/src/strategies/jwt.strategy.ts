import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

import { IJwtPayload } from '@leaa/common/interfaces';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { AuthService } from '@leaa/api/modules/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.JWT_SECRET_KEY,
      jsonWebTokenOptions: {
        expiresIn: configService.SERVER_COOKIE_EXPIRES_DAY * (60 * 60 * 24),
      },
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.authService.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
