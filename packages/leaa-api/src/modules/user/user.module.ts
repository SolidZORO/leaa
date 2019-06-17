import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, Permission } from '@leaa/common/entrys';

import { UserService } from '@leaa/api/modules/user/user.service';
import { UserResolver } from '@leaa/api/modules/user/user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
