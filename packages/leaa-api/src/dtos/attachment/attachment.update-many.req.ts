import { IsNotEmpty } from 'class-validator';

import { Attachment } from '@leaa/api/src/entrys';

export class AttachmentUpdateManyReq {
  @IsNotEmpty()
  attachments!: Attachment[];
}
