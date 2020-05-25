import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';
import { ConfigModule } from '@leaa/api/src/modules/v1/config/config.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.JWT_SECRET_KEY,
      }),
    }),
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthTokenModule {}
