import { Zan } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class ZansWithPaginationObject extends PaginationObject {
  readonly items: Zan[] = [];
}
