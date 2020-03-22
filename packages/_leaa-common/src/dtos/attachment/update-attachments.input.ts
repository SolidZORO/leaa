import { Field, InputType } from '@nestjs/graphql';

import { UpdateAttachmentInput } from './update-attachment.input';

@InputType()
export class UpdateAttachmentsInput extends UpdateAttachmentInput {
  @Field(() => String)
  uuid!: string;
}
