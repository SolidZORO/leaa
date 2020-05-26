import { Action } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class ActionsWithPaginationObject extends PaginationObject {
  readonly items: Action[] = [];
}
