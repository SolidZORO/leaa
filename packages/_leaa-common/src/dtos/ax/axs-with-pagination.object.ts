import { ObjectType, Field } from 'type-graphql';

import { Ax } from '@leaa/common/entrys';
import { PaginationObject } from '@leaa/common/dtos/_common';

@ObjectType()
export class AxsWithPaginationObject extends PaginationObject {
  @Field(() => [Ax])
  readonly items: Ax[] = [];
}
