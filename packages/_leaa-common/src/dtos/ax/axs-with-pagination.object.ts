import { ObjectType, Field } from 'type-graphql';

import { Ax } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class AxsWithPaginationObject extends PaginationObject {
  @Field(() => [Ax])
  readonly items: Ax[] = [];
}
