import { User } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class UsersWithPaginationObject extends PaginationObject {
  readonly items: User[] = [];
}
