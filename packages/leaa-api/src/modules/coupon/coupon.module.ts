import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Coupon } from '@leaa/common/src/entrys';
import { CouponService } from '@leaa/api/src/modules/coupon/coupon.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon])],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
