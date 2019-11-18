import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Coupon } from '@leaa/common/src/entrys';
import { CouponService } from '@leaa/api/src/modules/coupon/coupon.service';
import { AttachmentModule } from '@leaa/api/src/modules/attachment/attachment.module';
import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon]), AuthTokenModule, AttachmentModule],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
