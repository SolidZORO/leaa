import { Module } from '@nestjs/common';

import { PermissionModule } from '@leaa/api/modules/permission/permission.module';
import { RoleModule } from '@leaa/api/modules/role/role.module';
import { UserModule } from '@leaa/api/modules/user/user.module';
import { ArticleModule } from '@leaa/api/modules/article/article.module';
import { CategoryModule } from '@leaa/api/modules/category/category.module';
import { AxModule } from '@leaa/api/modules/ax/ax.module';

import { SeedService } from '@leaa/api/modules/seed/seed.service';

@Module({
  imports: [PermissionModule, RoleModule, UserModule, ArticleModule, CategoryModule, AxModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
