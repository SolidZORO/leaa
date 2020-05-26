import { IsNotEmpty } from 'class-validator';

import { Attachment } from '@leaa/common/src/entrys';

export class UpdateAttachmentsInput {
  @IsNotEmpty()
  attachments!: Attachment[];
}
