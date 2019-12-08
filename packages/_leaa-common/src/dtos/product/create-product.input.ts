import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int, Float } from 'type-graphql';

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
  @Field(() => [Int], { nullable: true })
  brandIds?: number[];

  @IsOptional()
  @Field(() => [Int], { nullable: true })
  styleIds?: number[];

  @IsOptional()
  @Field(() => [Int], { nullable: true })
  tagIds?: number[];

  @IsOptional()
  @Field(() => [Int], { nullable: true })
  bannerIds?: number[];
}
