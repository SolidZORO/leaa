import { Module } from '@nestjs/common';

import { PermissionModule } from '@leaa/api/src/modules/permission/permission.module';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { UserModule } from '@leaa/api/src/modules/user/user.module';
import { ArticleModule } from '@leaa/api/src/modules/article/article.module';
import { CategoryModule } from '@leaa/api/src/modules/category/category.module';
import { AxModule } from '@leaa/api/src/modules/ax/ax.module';
import { SettingModule } from '@leaa/api/src/modules/setting/setting.module';

import { SeedService } from '@leaa/api/src/modules/seed/seed.service';

@Module({
  imports: [PermissionModule, RoleModule, UserModule, ArticleModule, CategoryModule, AxModule, SettingModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
