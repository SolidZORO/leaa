import { Attachment } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class AttachmentsWithPaginationObject extends PaginationObject {
  readonly items: Attachment[] = [];
}
