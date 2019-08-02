import { ObjectType, Field } from 'type-graphql';

import { Setting } from '@leaa/common/entrys';
import { PaginationObject } from '@leaa/common/dtos/_common';

@ObjectType()
export class SettingsWithPaginationObject extends PaginationObject {
  @Field(() => [Setting])
  readonly items: Setting[] = [];
}
