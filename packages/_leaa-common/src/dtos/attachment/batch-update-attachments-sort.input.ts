import { IsNotEmpty } from 'class-validator';

import { Attachment } from '@leaa/common/src/entrys';

export class BatchUpdateAttachmentsSortInput {
  @IsNotEmpty()
  attachments!: Pick<Attachment, 'id' | 'sort'>[];
}
