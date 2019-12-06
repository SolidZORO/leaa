import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

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
  @Field(() => Int, { nullable: true })
  parent_id?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  // @IsOptional()
  // @Field(() => Category, { nullable: true })
  parent?: Category;
}
