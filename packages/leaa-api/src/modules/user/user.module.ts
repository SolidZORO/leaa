import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, Permission, Auth } from '@leaa/common/src/entrys';

import { UserService } from '@leaa/api/src/modules/user/user.service';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';
import { UserResolver } from '@leaa/api/src/modules/user/user.resolver';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';
import { AttachmentModule } from '@leaa/api/src/modules/attachment/attachment.module';
import { AuthModule } from '@leaa/api/src/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Auth]),
    RoleModule,
    AuthTokenModule,
    AttachmentModule,
    AuthModule,
  ],
  providers: [UserResolver, UserService, UserProperty],
  exports: [UserResolver, UserService, UserProperty],
})
export class UserModule {}
