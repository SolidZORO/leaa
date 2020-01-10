import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, Permission, Address, Auth, Attachment } from '@leaa/common/src/entrys';

import { UserService } from '@leaa/api/src/modules/user/user.service';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';
import { UserResolver } from '@leaa/api/src/modules/user/user.resolver';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';
import { AttachmentModule } from '@leaa/api/src/modules/attachment/attachment.module';
import { AuthResolver } from '@leaa/api/src/modules/auth/auth.resolver';
import { AuthLocalService } from '@leaa/api/src/modules/auth/auth-local.service';
import { AuthWechatService } from '@leaa/api/src/modules/auth/auth-wechat.service';
import { AuthMiniprogramService } from '@leaa/api/src/modules/auth/auth-miniprogram.service';
import { AuthGithubService } from '@leaa/api/src/modules/auth/auth-github.service';
import { RoleService } from '@leaa/api/src/modules/role/role.service';
import { PermissionService } from '@leaa/api/src/modules/permission/permission.service';
import { AuthModule } from '@leaa/api/src/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Address, Auth, Attachment]),
    RoleModule,
    AuthTokenModule,
    AttachmentModule,
    AuthModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    AuthLocalService,
    AuthWechatService,
    AuthMiniprogramService,
    AuthGithubService,
    //
    UserResolver,
    UserService,
    UserProperty,
    //
    RoleService,
    PermissionService,
  ],
  exports: [
    AuthResolver,
    AuthService,
    AuthLocalService,
    AuthWechatService,
    AuthMiniprogramService,
    AuthGithubService,
    //
    UserResolver,
    UserService,
    UserProperty,
    //
    RoleService,
    PermissionService,
  ],
})
export class UserModule {}
