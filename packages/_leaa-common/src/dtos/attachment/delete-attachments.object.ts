import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class DeleteAttachmentsObject {
  @Field(() => [String])
  readonly items: string[] = [];
}
