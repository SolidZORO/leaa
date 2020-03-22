import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SyncTagsToFileObject {
  @Field(() => String)
  status?: string;
}
