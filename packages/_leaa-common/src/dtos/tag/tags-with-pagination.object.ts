import { Tag } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class TagsWithPaginationObject extends PaginationObject {
  readonly items: Tag[] = [];
}
