import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, Permission } from '@leaa/common/entrys';

import { UserService } from '@leaa/api/modules/user/user.service';
import { UserResolver } from '@leaa/api/modules/user/user.resolver';
import { RoleModule } from '@leaa/api/modules/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), RoleModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
