import { IsOptional } from 'class-validator';
import { ArgsType, Field, Int } from '@nestjs/graphql';

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
  @Field(() => String, { nullable: true })
  moduleId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  typeName?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  typePlatform?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  categoryId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  userId?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  refreshHash?: number;
}
