import { ObjectType, Field } from '@nestjs/graphql';

import { User } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class UsersWithPaginationObject extends PaginationObject {
  @Field(() => [User])
  readonly items: User[] = [];
}
