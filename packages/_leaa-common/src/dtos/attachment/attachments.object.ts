import { ObjectType, Field } from '@nestjs/graphql';

import { Attachment } from '@leaa/common/src/entrys';

@ObjectType()
export class AttachmentsObject {
  @Field(() => [Attachment])
  readonly items: Attachment[] = [];
}
