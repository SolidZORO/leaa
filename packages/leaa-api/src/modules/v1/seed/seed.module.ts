import { Module } from '@nestjs/common';

import { PermissionModule } from '@leaa/api/src/modules/v1/permission/permission.module';
import { RoleModule } from '@leaa/api/src/modules/v1/role/role.module';
import { UserModule } from '@leaa/api/src/modules/v1/user/user.module';
import { ArticleModule } from '@leaa/api/src/modules/v1/article/article.module';
import { CategoryModule } from '@leaa/api/src/modules/v1/category/category.module';
import { AxModule } from '@leaa/api/src/modules/v1/ax/ax.module';
import { AuthModule } from '@leaa/api/src/modules/v1/auth/auth.module';
import { SettingModule } from '@leaa/api/src/modules/v1/setting/setting.module';
import { ActionModule } from '@leaa/api/src/modules/v1/action/action.module';

import { SeedService } from '@leaa/api/src/modules/v1/seed/seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment, Action, User } from '@leaa/common/src/entrys';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment, Action, User]),
    PermissionModule,
    RoleModule,
    UserModule,
    ArticleModule,
    CategoryModule,
    AxModule,
    AuthModule,
    SettingModule,
    ActionModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
