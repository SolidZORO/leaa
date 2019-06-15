import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role } from '@leaa/common/entrys';
import { UserService } from '@leaa/api/modules/user/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [AuthResolver, AuthService, UserService],
})
export class AuthModule {}
