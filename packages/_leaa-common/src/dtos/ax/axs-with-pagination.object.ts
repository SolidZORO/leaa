import { Ax } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class AxsWithPaginationObject extends PaginationObject {
  readonly items: Ax[] = [];
}
