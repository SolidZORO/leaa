import { Auth } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class AuthsWithPaginationObject extends PaginationObject {
  readonly items: Auth[] = [];
}
