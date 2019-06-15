import { ArgsType, Field } from 'type-graphql';

import { ItemArgs } from '@leaa/common/dtos/_common';
import { Permission } from '@leaa/common/entrys';

@ArgsType()
export class UserArgs extends ItemArgs {
  // @Field(() => [Permission], { nullable: true })
  // readonly permissions?: Permission[];
}
