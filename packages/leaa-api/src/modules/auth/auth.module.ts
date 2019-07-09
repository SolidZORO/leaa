import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { User, Role, Permission } from '@leaa/common/entrys';

import { UserService } from '@leaa/api/modules/user/user.service';
import { RoleService } from '@leaa/api/modules/role/role.service';
import { UserResolver } from '@leaa/api/modules/user/user.resolver';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { PermissionService } from '@leaa/api/modules/permission/permission.service';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.JWT_SECRET_KEY,
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, UserResolver, UserService, RoleService, PermissionService],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
