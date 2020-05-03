import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

import { Category } from '@leaa/common/src/entrys';

@InputType()
export class UpdateCategoryInput {
  @IsOptional()
  @Field(() => String)
  name?: string;

  @IsOptional()
  @Field(() => String)
  slug?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  parent_id?: string | null;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  // @IsOptional()
  // @Field(() => Category, { nullable: true })
  parent?: Category | null;
}
