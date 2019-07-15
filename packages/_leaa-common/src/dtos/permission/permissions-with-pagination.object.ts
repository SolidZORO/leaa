import { ObjectType, Field } from 'type-graphql';

import { Permission } from '@leaa/common/entrys';
import { PaginationObject } from '@leaa/common/dtos/_common';

@ObjectType()
export class PermissionsWithPaginationObject extends PaginationObject {
  @Field(() => [Permission])
  readonly items: Permission[] = [];
}
