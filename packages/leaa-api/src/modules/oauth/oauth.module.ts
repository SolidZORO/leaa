import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { User, Role, Permission } from '@leaa/common/src/entrys';

import { OauthResolver } from '@leaa/api/src/modules/oauth/oauth.resolver';
import { OauthService } from '@leaa/api/src/modules/oauth/oauth.service';
import { OauthController } from '@leaa/api/src/modules/oauth/oauth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), PassportModule],
  controllers: [OauthController],
  providers: [OauthResolver, OauthService],
  exports: [PassportModule, OauthService],
})
export class OauthModule {}
