import { ObjectType, Field } from 'type-graphql';

import { Category } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class CategoriesWithPaginationObject extends PaginationObject {
  @Field(() => [Category])
  readonly items: Category[] = [];
}
