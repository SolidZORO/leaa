import { Promo } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class PromosWithPaginationObject extends PaginationObject {
  readonly items: Promo[] = [];
}
