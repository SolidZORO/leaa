import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, Permission, Oauth } from '@leaa/common/src/entrys';

import { OauthResolver } from '@leaa/api/src/modules/oauth/oauth.resolver';
import { OauthService } from '@leaa/api/src/modules/oauth/oauth.service';
import { OauthController } from '@leaa/api/src/modules/oauth/oauth.controller';
import { AuthModule } from '@leaa/api/src/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, Oauth]), AuthModule],
  controllers: [OauthController],
  providers: [OauthResolver, OauthService],
  exports: [OauthService],
})
export class OauthModule {}
