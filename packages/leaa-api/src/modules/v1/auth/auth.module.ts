import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthTokenModule } from '@leaa/api/src/modules/v1/auth-token/auth-token.module';

import { User, Role, Permission, Auth, Verification, Action } from '@leaa/common/src/entrys';

import { UserService } from '@leaa/api/src/modules/v1/user/user.service';
import { UserProperty } from '@leaa/api/src/modules/v1/user/user.property';
import { RoleService } from '@leaa/api/src/modules/v1/role/role.service';
import { PermissionService } from '@leaa/api/src/modules/v1/permission/permission.service';

import { AuthService } from '@leaa/api/src/modules/v1/auth/auth.service';
import { AuthController } from '@leaa/api/src/modules/v1/auth/auth.controller';

import { ActionService } from '@leaa/api/src/modules/v1/action/action.service';

import { GithubStrategy, JwtStrategy } from '@leaa/api/src/strategies';
import { AttachmentModule } from '@leaa/api/src/modules/v1/attachment/attachment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Auth, Verification, Action]),
    AuthTokenModule,
    AttachmentModule,
  ],
  providers: [
    // GithubStrategy,
    JwtStrategy,
    ActionService,
    //
    // AuthResolver222222222,
    AuthService,
    //
    // UserResolver,
    UserService,
    UserProperty,
    //
    RoleService,
    PermissionService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
