import { IsNotEmpty } from 'class-validator';

import { Attachment } from '@leaa/common/src/entrys';

export class AttachmentUpdateManyReq {
  @IsNotEmpty()
  attachments!: Attachment[];
}
