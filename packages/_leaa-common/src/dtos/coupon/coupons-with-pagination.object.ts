import { Coupon } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class CouponsWithPaginationObject extends PaginationObject {
  readonly items: Coupon[] = [];
}
