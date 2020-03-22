import { ObjectType, Field } from '@nestjs/graphql';

import { Auth } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class AuthsWithPaginationObject extends PaginationObject {
  @Field(() => [Auth])
  readonly items: Auth[] = [];
}
