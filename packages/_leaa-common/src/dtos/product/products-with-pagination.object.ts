import { Product } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class ProductsWithPaginationObject extends PaginationObject {
  readonly items: Product[] = [];
}
