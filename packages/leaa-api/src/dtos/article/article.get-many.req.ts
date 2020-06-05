import { BaseGetManyReq } from '@leaa/api/src/dtos/_common';

export class ArticleGetManyReq extends BaseGetManyReq {
  tagName?: string;

  categoryName?: string;

  categoryId?: string;
}
