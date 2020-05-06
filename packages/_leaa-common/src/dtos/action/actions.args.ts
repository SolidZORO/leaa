import { ArgsType, Field } from '@nestjs/graphql';

import { ItemsArgs } from '@leaa/common/src/dtos/_common';

@ArgsType()
export class ActionsArgs extends ItemsArgs {
  @Field(() => String, { nullable: true })
  tagName?: string;

  @Field(() => String, { nullable: true })
  categoryName?: string;

  @Field(() => String, { nullable: true })
  categoryId?: string;
}
