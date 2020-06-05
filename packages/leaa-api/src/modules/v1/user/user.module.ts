import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, Permission, Auth, Verification, Attachment } from '@leaa/common/src/entrys';

import { UserService } from '@leaa/api/src/modules/v1/user/user.service';
import { RoleModule } from '@leaa/api/src/modules/v1/role/role.module';
import { AuthTokenModule } from '@leaa/api/src/modules/v1/auth-token/auth-token.module';
import { AttachmentModule } from '@leaa/api/src/modules/v1/attachment/attachment.module';
import { AuthModule } from '@leaa/api/src/modules/v1/auth/auth.module';
import { UserController } from '@leaa/api/src/modules/v1/user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Auth, Verification, Attachment]),
    RoleModule,
    AuthTokenModule,
    AttachmentModule,
    AuthModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
