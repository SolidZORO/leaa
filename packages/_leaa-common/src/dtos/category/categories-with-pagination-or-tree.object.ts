import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Category } from '@leaa/common/src/entrys';
import { CategoryTreeObject } from '@leaa/common/src/dtos/category/category-tree.object';

@ObjectType()
export class CategoriesWithPaginationOrTreeObject {
  @Field(() => Int, { nullable: true })
  readonly page?: number;

  @Field(() => Int, { nullable: true })
  readonly pageSize?: number;

  @Field(() => Int, { nullable: true })
  readonly nextPage?: number | null;

  @Field(() => Int, { nullable: true })
  readonly itemsCount?: number;

  @Field(() => Int, { nullable: true })
  readonly total?: number;

  @Field(() => [Category], { nullable: true })
  readonly items?: Category[] = [];

  @Field(() => [CategoryTreeObject], { nullable: true })
  readonly trees?: CategoryTreeObject[] = [];
}
