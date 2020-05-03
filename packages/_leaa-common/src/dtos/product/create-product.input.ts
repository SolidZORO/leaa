import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @IsNotEmpty()
  @Field(() => String)
  name!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  fullname?: string;

  @IsNotEmpty()
  @Field(() => String)
  serial!: string;

  @IsNotEmpty()
  @Field(() => Float)
  price!: number;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  cost_price?: number;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  market_price?: number;

  @IsNotEmpty()
  @Field(() => Int)
  status!: number;

  @IsNotEmpty()
  @Field(() => Int)
  stock!: number;

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
  @Field(() => [String], { nullable: true })
  brandIds?: string[] | null;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  styleIds?: string[] | null;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  tagIds?: string[] | null;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  bannerIds?: string[] | null;
}
