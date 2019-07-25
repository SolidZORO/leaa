import { ObjectType, Field } from 'type-graphql';
import { Attachment } from '@leaa/common/entrys';

@ObjectType()
export class AxAttachmentsObject {
  @Field(() => [Attachment])
  public readonly bannerMbList: Attachment[] = [];

  @Field(() => [Attachment])
  public readonly bannerPcList: Attachment[] = [];

  @Field(() => [Attachment])
  public readonly galleryMbList: Attachment[] = [];

  @Field(() => [Attachment])
  public readonly galleryPcList: Attachment[] = [];
}
