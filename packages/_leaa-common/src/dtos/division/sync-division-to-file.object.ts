import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SyncDivisionToFileObject {
  @Field(() => String)
  status?: string;
}
