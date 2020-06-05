import { BaseGetManyReq } from '@leaa/api/src/dtos/_common';

export class ActionGetManyReq extends BaseGetManyReq {
  tagName?: string;

  categoryName?: string;

  categoryId?: string;
}
