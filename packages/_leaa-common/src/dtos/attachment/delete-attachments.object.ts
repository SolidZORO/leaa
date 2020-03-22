import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DeleteAttachmentsObject {
  @Field(() => [String])
  readonly items: string[] = [];
}
