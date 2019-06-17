import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { User, Role, Permission } from '@leaa/common/entrys';

import { UserService } from '@leaa/api/modules/user/user.service';
import { UserResolver } from '@leaa/api/modules/user/user.resolver';
import { ConfigService } from '@leaa/api/modules/config/config.service';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.JWT_SECRET_KEY,
        // https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
        signOptions: {
          expiresIn: `${configService.SERVER_COOKIE_EXPIRES_DAY}d`,
        },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, UserResolver, UserService],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
