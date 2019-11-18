import { ObjectType, Field } from 'type-graphql';

import { Coupon } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class CouponsWithPaginationObject extends PaginationObject {
  @Field(() => [Coupon])
  readonly items: Coupon[] = [];
}
