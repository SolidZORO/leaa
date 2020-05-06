import { ObjectType, Field } from '@nestjs/graphql';

import { Action } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class ActionsWithPaginationObject extends PaginationObject {
  @Field(() => [Action])
  readonly items: Action[] = [];
}
