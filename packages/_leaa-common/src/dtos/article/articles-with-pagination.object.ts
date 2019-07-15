import { ObjectType, Field } from 'type-graphql';

import { Article } from '@leaa/common/entrys';
import { PaginationObject } from '@leaa/common/dtos/_common';

@ObjectType()
export class ArticlesWithPaginationObject extends PaginationObject {
  @Field(() => [Article])
  readonly items: Article[] = [];
}
