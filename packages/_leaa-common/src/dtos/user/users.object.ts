import { ObjectType, Field } from 'type-graphql';

import { User } from '@leaa/common/entrys';
import { PaginationResponse } from '@leaa/common/dtos/_common';

@ObjectType()
export class UsersResponse extends PaginationResponse {
  @Field(() => [User])
  readonly items: User[] = [];
}
