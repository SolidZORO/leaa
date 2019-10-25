import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class SyncTagsToFileObject {
  @Field(() => String)
  status?: string;
}
