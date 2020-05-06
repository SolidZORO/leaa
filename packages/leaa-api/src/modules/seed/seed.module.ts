import { Module } from '@nestjs/common';

import { PermissionModule } from '@leaa/api/src/modules/permission/permission.module';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { UserModule } from '@leaa/api/src/modules/user/user.module';
import { ActionModule } from '@leaa/api/src/modules/article/action.module';
import { CategoryModule } from '@leaa/api/src/modules/category/category.module';
import { AxModule } from '@leaa/api/src/modules/ax/ax.module';
import { SettingModule } from '@leaa/api/src/modules/setting/setting.module';
import { CouponModule } from '@leaa/api/src/modules/coupon/coupon.module';
import { PromoModule } from '@leaa/api/src/modules/promo/promo.module';

import { SeedService } from '@leaa/api/src/modules/seed/seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from '@leaa/common/src/entrys';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    PermissionModule,
    RoleModule,
    UserModule,
    ActionModule,
    CategoryModule,
    AxModule,
    SettingModule,
    CouponModule,
    PromoModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
