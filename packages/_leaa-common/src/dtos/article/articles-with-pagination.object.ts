import { ObjectType, Field } from 'type-graphql';

import { Article } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class ArticlesWithPaginationObject extends PaginationObject {
  @Field(() => [Article])
  public readonly items: Article[] = [];
}
