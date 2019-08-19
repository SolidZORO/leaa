import { ObjectType, Field } from 'type-graphql';

import { Attachment } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class AttachmentsWithPaginationObject extends PaginationObject {
  @Field(() => [Attachment])
  public readonly items: Attachment[] = [];
}
