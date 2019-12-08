import { ArgsType, Field, Int } from 'type-graphql';

import { ItemsArgs } from '@leaa/common/src/dtos/_common';

@ArgsType()
export class ProductsArgs extends ItemsArgs {
  @Field(() => String, { nullable: true })
  tagName?: string;

  @Field(() => String, { nullable: true })
  styleName?: string;

  @Field(() => String, { nullable: true })
  brandName?: string;

  @Field(() => Int, { nullable: true })
  styleId?: number;

  @Field(() => Int, { nullable: true })
  brandId?: number;
}
