import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, Permission } from '@leaa/common/entrys';

import { UserService } from '@leaa/api/modules/user/user.service';
import { UserResolver } from '@leaa/api/modules/user/user.resolver';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  providers: [AuthResolver, AuthService, UserResolver, UserService],
})
export class AuthModule {}
