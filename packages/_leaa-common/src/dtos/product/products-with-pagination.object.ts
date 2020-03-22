import { ObjectType, Field } from '@nestjs/graphql';

import { Product } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class ProductsWithPaginationObject extends PaginationObject {
  @Field(() => [Product])
  readonly items: Product[] = [];
}
