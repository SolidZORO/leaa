import { ObjectType, Field } from '@nestjs/graphql';

import { Article } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class ArticlesWithPaginationObject extends PaginationObject {
  @Field(() => [Article])
  readonly items: Article[] = [];
}
