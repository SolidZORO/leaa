import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, Permission } from '@leaa/common/src/entrys';

import { UserService } from '@leaa/api/src/modules/user/user.service';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';
import { UserResolver } from '@leaa/api/src/modules/user/user.resolver';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), AuthTokenModule, RoleModule],
  providers: [UserResolver, UserService, UserProperty],
  exports: [UserService],
})
export class UserModule {}
