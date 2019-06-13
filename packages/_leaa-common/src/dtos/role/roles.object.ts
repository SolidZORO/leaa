import { ObjectType, Field } from 'type-graphql';

import { Role } from '@leaa/common/entrys';
import { PaginationObject } from '@leaa/common/dtos/_common';

@ObjectType()
export class RolesObject extends PaginationObject {
  @Field(() => [Role])
  readonly items: Role[] = [];
}
