import { ObjectType, Field } from '@nestjs/graphql';

import { Role } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class RolesWithPaginationObject extends PaginationObject {
  @Field(() => [Role])
  readonly items: Role[] = [];
}
