import { IsOptional } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

import { ItemsArgs } from '@leaa/common/dtos/_common';

@ArgsType()
export class AttachmentsArgs extends ItemsArgs {
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly type?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly moduleName?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  readonly moduleId?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly moduleType?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  readonly categoryId?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  readonly userId?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  readonly refreshHash?: number;
}
