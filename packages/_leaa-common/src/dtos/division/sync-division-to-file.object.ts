import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class SyncDivisionToFileObject {
  @Field(() => String)
  status?: string;
}
