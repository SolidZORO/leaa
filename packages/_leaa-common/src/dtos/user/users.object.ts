import { ObjectType, Field } from 'type-graphql';

import { User } from '@leaa/common/entrys';
import { PaginationObject } from '@leaa/common/dtos/_common';

@ObjectType()
export class UsersObject extends PaginationObject {
  @Field(() => [User])
  readonly items: User[] = [];
}
