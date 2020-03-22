import { ObjectType, Field } from '@nestjs/graphql';
import { Attachment } from '@leaa/common/src/entrys';

@ObjectType()
export class AxAttachmentsObject {
  @Field(() => [Attachment])
  readonly bannerMbList: Attachment[] = [];

  @Field(() => [Attachment])
  readonly bannerPcList: Attachment[] = [];

  @Field(() => [Attachment])
  readonly galleryMbList: Attachment[] = [];

  @Field(() => [Attachment])
  readonly galleryPcList: Attachment[] = [];
}
