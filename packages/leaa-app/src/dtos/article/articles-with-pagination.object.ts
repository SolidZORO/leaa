import { Article } from '@leaa/app/src/entrys';
import { PaginationObject } from '@leaa/app/src/dtos/_common';

export interface ArticlesWithPaginationObject extends PaginationObject {
  items: Article[];
}
