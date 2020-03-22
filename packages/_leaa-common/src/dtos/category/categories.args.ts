import { ArgsType, Field, Int } from '@nestjs/graphql';

import { ItemsArgs } from '@leaa/common/src/dtos/_common';

@ArgsType()
export class CategoriesArgs extends ItemsArgs {
  @Field(() => Boolean, { nullable: true })
  expanded?: boolean;

  @Field(() => Boolean, { nullable: true })
  listType?: boolean;

  @Field(() => Boolean, { nullable: true })
  treeType?: boolean;

  @Field(() => String, { nullable: true })
  parentSlug?: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  // findDescendantsTree include parent category (default: parent.children)
  @Field(() => Boolean, { nullable: true })
  includeParent?: boolean;
}
