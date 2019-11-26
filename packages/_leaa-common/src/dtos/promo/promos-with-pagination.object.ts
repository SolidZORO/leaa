import { ObjectType, Field } from 'type-graphql';

import { Promo } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class PromosWithPaginationObject extends PaginationObject {
  @Field(() => [Promo])
  readonly items: Promo[] = [];
}
