import { ObjectType, Field } from 'type-graphql';

import { User } from '@leaa/common/entrys';

@ObjectType()
export class UserResponse {
  @Field(() => User)
  readonly item?: User;
}
