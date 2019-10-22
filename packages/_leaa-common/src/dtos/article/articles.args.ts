import { ArgsType, Field, Int } from 'type-graphql';

import { ItemsArgs } from '@leaa/common/src/dtos/_common';

@ArgsType()
export class ArticlesArgs extends ItemsArgs {
  @Field(() => String, { nullable: true })
  public readonly tagName?: string;

  @Field(() => String, { nullable: true })
  public readonly categoryName?: string;

  @Field(() => Int, { nullable: true })
  public readonly categoryId?: number;
}
