import { BaseGetManyReq } from '@leaa/common/src/dtos/_common';

export class ArticleGetManyReq extends BaseGetManyReq {
  tagName?: string;

  categoryName?: string;

  categoryId?: string;
}
