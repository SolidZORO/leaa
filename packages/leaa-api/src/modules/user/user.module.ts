import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, Permission } from '@leaa/common/entrys';

import { UserService } from '@leaa/api/modules/user/user.service';
import { UserResolver } from '@leaa/api/modules/user/user.resolver';
import { RoleModule } from '@leaa/api/modules/role/role.module';
import { AuthTokenModule } from '@leaa/api/modules/auth-token/auth-token.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), AuthTokenModule, RoleModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
