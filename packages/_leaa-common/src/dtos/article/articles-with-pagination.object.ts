import { Article } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class ArticlesWithPaginationObject extends PaginationObject {
  readonly items: Article[] = [];
}
