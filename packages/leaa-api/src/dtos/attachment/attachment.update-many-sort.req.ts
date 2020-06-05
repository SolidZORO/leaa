import { IsNotEmpty } from 'class-validator';

import { Attachment } from '@leaa/api/src/entrys';

export class AttachmentUpdateManySortReq {
  @IsNotEmpty()
  attachments!: Pick<Attachment, 'id' | 'sort'>[];
}
