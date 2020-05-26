import { Role } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class RolesWithPaginationObject extends PaginationObject {
  readonly items: Role[] = [];
}
