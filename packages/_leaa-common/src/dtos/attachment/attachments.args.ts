import { ArgsType, Field, Int } from 'type-graphql';

import { ItemsArgs } from '@leaa/common/dtos/_common';

@ArgsType()
export class AttachmentsArgs extends ItemsArgs {
  @Field(() => String, { nullable: true })
  readonly type?: string;

  @Field(() => String, { nullable: true })
  readonly moduleName?: string;

  @Field(() => Int, { nullable: true })
  readonly moduleId?: number;

  @Field(() => String, { nullable: true })
  readonly moduleType?: string;

  @Field(() => Int, { nullable: true })
  readonly categoryId?: number;

  @Field(() => Int, { nullable: true })
  readonly userId?: number;
}
