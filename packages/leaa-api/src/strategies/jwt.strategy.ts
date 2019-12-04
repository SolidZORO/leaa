import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import { IJwtPayload } from '@leaa/common/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';

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
        expiresIn: configService.SERVER_COOKIE_EXPIRES_DAY * (60 * 60 * 24),
      },
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.authService.validateUserByPayload(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user && user.status !== 1) {
      throw new UnauthorizedException();
    }

    return user;
  }

  // authenticate(req: Request, options?: any): void {
  //   console.log('QQQQQQQQQQQQQQQQQQQ', req.header);
  //
  //   // logger.log(`validate ${r(options)}`);
  //   // const self: Strategy = this as any;
  //   // const key = getIgnoreCase(req.headers, API_KEY_HEADER) as string;
  //   // if (key) {
  //   //   // TODO verify api key later
  //   //   self.success({ apiKey: key });
  //   // } else {
  //   //   self.fail('ApiKey is required', 401);
  //   // }
  // }

  // authenticate(req: Request, options?: any): void {
  //   logger.log(`validate ${r(options)}`);
  //   const self: Strategy = this as any;
  //   const key = getIgnoreCase(req.headers, API_KEY_HEADER) as string;
  //   if (key) {
  //     // TODO verify api key later
  //     self.success({ apiKey: key });
  //   } else {
  //     self.fail('ApiKey is required', 401);
  //   }
  // }
}
