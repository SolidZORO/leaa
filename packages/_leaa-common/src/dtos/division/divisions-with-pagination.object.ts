import { ObjectType, Field } from 'type-graphql';

import { Division } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class DivisionsWithPaginationObject extends PaginationObject {
  @Field(() => [Division])
  readonly items: Division[] = [];
}
