import { ArgsType, Field, Int } from 'type-graphql';

import { ItemsArgs } from '@leaa/common/src/dtos/_common';

@ArgsType()
export class ArticlesArgs extends ItemsArgs {
  @Field(() => String, { nullable: true })
  readonly tagName?: string;

  @Field(() => String, { nullable: true })
  readonly categoryName?: string;

  @Field(() => Int, { nullable: true })
  readonly categoryId?: number;
}
