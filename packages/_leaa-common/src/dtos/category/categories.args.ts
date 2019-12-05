import { ArgsType, Field } from 'type-graphql';

import { ItemsArgs } from '@leaa/common/src/dtos/_common';

@ArgsType()
export class CategoriesArgs extends ItemsArgs {
  @Field(() => Boolean, { nullable: true })
  readonly expanded?: boolean;

  @Field(() => Boolean, { nullable: true })
  readonly listType?: boolean;

  @Field(() => Boolean, { nullable: true })
  readonly treeType?: boolean;
}
