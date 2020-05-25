import { Module } from '@nestjs/common';

import { PermissionModule } from '@leaa/api/src/modules/permission/permission.module';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { UserModule } from '@leaa/api/src/modules/user/user.module';
import { ArticleModule } from '@leaa/api/src/modules/article/article.module';
import { CategoryModule } from '@leaa/api/src/modules/category/category.module';
import { AxModule } from '@leaa/api/src/modules/ax/ax.module';
import { SettingModule } from '@leaa/api/src/modules/setting/setting.module';
import { ActionModule } from '@leaa/api/src/modules/action/action.module';

import { SeedService } from '@leaa/api/src/modules/seed/seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment, Action } from '@leaa/common/src/entrys';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment, Action]),
    PermissionModule,
    RoleModule,
    UserModule,
    ArticleModule,
    CategoryModule,
    AxModule,
    SettingModule,
    ActionModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
