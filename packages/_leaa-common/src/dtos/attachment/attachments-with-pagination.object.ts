import { ObjectType, Field } from 'type-graphql';

import { Attachment } from '@leaa/common/entrys';
import { PaginationObject } from '@leaa/common/dtos/_common';

@ObjectType()
export class AttachmentsWithPaginationObject extends PaginationObject {
  @Field(() => [Attachment])
  public readonly items: Attachment[] = [];
}
