import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int, Float } from 'type-graphql';

import { Tag } from '@leaa/common/src/entrys';

@InputType()
export class CreateProductInput {
  @IsNotEmpty()
  @Field(() => String)
  name!: string;

  @IsOptional()
  @Field(() => String)
  fullname!: string;

  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  serial?: string;

  @IsNotEmpty()
  @Field(() => Float)
  price!: number;

  @IsOptional()
  @Field(() => Float)
  cost_price?: number;

  @IsOptional()
  @Field(() => Float)
  original_price?: number;

  @IsNotEmpty()
  @Field(() => Int)
  status!: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  sort?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  content?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  brandCategoryId?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  styleCategoryId?: number;

  @IsOptional()
  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];
}
