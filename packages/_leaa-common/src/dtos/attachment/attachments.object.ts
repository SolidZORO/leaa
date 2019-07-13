import { ObjectType, Field } from 'type-graphql';

import { Attachment } from '@leaa/common/entrys';
import { PaginationObject } from '@leaa/common/dtos/_common';

@ObjectType()
export class AttachmentsObject extends PaginationObject {

  @Field(() => [Attachment])
  readonly items: Attachment[] = [];
}
