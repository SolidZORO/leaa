import { Division } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class DivisionsWithPaginationObject extends PaginationObject {
  readonly items: Division[] = [];
}
