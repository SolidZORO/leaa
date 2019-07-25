import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class DeleteAttachmentsObject {
  @Field(() => [String])
  public readonly items: string[] = [];
}
