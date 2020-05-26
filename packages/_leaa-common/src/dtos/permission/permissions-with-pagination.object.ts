import { Permission } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class PermissionsWithPaginationObject extends PaginationObject {
  readonly items: Permission[] = [];
}
