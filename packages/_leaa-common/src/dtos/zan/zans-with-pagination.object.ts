import { ObjectType, Field } from '@nestjs/graphql';

import { Zan } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class ZansWithPaginationObject extends PaginationObject {
  @Field(() => [Zan])
  readonly items: Zan[] = [];
}
