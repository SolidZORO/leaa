import moment from 'moment';
import { Injectable } from '@nestjs/common';

import { Promo } from '@leaa/common/src/entrys';

// const CONSTRUCTOR_NAME = 'PromoProperty';

@Injectable()
export class PromoProperty {
  constructor() {}

  async resolvePropertyAvailable(promo: Promo): Promise<boolean> {
    if (
      typeof promo.quantity !== 'undefined' &&
      typeof promo.redeemed_quantity !== 'undefined' &&
      promo.quantity - promo.redeemed_quantity <= 0
    ) {
      return false;
    }

    return promo.status === 1 && moment().isBetween(promo.start_time, promo.expire_time);
  }
}
