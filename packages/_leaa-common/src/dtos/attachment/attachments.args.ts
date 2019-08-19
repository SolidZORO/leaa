import { IsOptional } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

import { ItemsArgs } from '@leaa/common/src/dtos/_common';

@ArgsType()
export class AttachmentsArgs extends ItemsArgs {
  @IsOptional()
  @Field(() => String, { nullable: true })
  public readonly type?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public readonly moduleName?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public readonly moduleId?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public readonly moduleType?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public readonly category_id?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public readonly user_id?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public readonly refreshHash?: number;
}
