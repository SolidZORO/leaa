import { ObjectType, Field } from 'type-graphql';
import { Attachment } from '@leaa/common/src/entrys';

@ObjectType()
export class ProductAttachmentsObject {
  @Field(() => [Attachment])
  readonly bannerMbList: Attachment[] = [];

  @Field(() => [Attachment])
  readonly bannerPcList: Attachment[] = [];

  @Field(() => [Attachment])
  readonly galleryMbList: Attachment[] = [];

  @Field(() => [Attachment])
  readonly galleryPcList: Attachment[] = [];
}
