import { ArgsType, Field, Int } from '@nestjs/graphql';

import { ItemsArgs } from '@leaa/common/src/dtos/_common';

@ArgsType()
export class ArticlesArgs extends ItemsArgs {
  @Field(() => String, { nullable: true })
  tagName?: string;

  @Field(() => String, { nullable: true })
  categoryName?: string;

  @Field(() => Int, { nullable: true })
  categoryId?: number;
}
