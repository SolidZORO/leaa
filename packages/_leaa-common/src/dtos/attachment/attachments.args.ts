import { IsOptional } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

import { ItemsArgs } from '@leaa/common/src/dtos/_common';

@ArgsType()
export class AttachmentsArgs extends ItemsArgs {
  @IsOptional()
  @Field(() => String, { nullable: true })
  type?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  moduleName?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  moduleId?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  moduleType?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  category_id?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  user_id?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  refreshHash?: number;
}
