import { ArgsType, Field } from 'type-graphql';

import { ItemsArgs } from '@leaa/common/dtos/_common';

@ArgsType()
export class CategoriesArgs extends ItemsArgs {
  @Field(() => String, { nullable: true, defaultValue: 'list' })
  public readonly type?: 'list' | 'tree' = 'list';
}
