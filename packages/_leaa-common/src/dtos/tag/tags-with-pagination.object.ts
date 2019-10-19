import { ObjectType, Field } from 'type-graphql';

import { Tag } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class TagsWithPaginationObject extends PaginationObject {
  @Field(() => [Tag])
  readonly items: Tag[] = [];
}
