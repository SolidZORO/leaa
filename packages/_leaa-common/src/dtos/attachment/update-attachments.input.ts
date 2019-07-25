import { Field, InputType } from 'type-graphql';

import { UpdateAttachmentInput } from './update-attachment.input';

@InputType()
export class UpdateAttachmentsInput extends UpdateAttachmentInput {
  @Field(() => String)
  public uuid!: string;
}
