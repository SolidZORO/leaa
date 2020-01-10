import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, Permission, Address, Attachment } from '@leaa/common/src/entrys';

import { UserService } from '@leaa/api/src/modules/user/user.service';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';
import { UserResolver } from '@leaa/api/src/modules/user/user.resolver';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';
import { AttachmentModule } from '@leaa/api/src/modules/attachment/attachment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Address, Attachment]),
    AuthTokenModule,
    RoleModule,
    AttachmentModule,
  ],
  providers: [UserResolver, UserService, UserProperty],
  exports: [UserService],
})
export class UserModule {}
