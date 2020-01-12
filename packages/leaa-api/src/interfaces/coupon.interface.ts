import { FindOneOptions } from 'typeorm';
import { CouponsArgs, CouponArgs } from '@leaa/common/src/dtos/coupon';
import { Coupon } from '@leaa/common/src/entrys';

export type ICouponsArgs = CouponsArgs & FindOneOptions<Coupon>;
export type ICouponArgs = CouponArgs & FindOneOptions<Coupon>;
