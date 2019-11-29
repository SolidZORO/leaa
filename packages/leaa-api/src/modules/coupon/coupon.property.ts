import moment from 'moment';
import { Injectable } from '@nestjs/common';

import { Coupon } from '@leaa/common/src/entrys';

// const CONSTRUCTOR_NAME = 'CouponProperty';

@Injectable()
export class CouponProperty {
  constructor() {}

  available(coupon: Coupon): boolean {
    return coupon.status === 1 && moment().isBetween(coupon.start_time, coupon.expire_time);
  }

  canRedeem(coupon: Coupon): boolean {
    return !coupon.user_id && coupon.status === 1 && moment().isBetween(coupon.start_time, coupon.expire_time);
  }
}
