import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int, Float } from 'type-graphql';

@InputType()
export class CreatePromoInput {
  @IsNotEmpty()
  @Field(() => String)
  name!: string;

  @IsNotEmpty()
  @Field(() => Int)
  quantity!: number;

  @IsNotEmpty()
  @Field(() => Float)
  amount!: number;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  over_amount?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  available_product_ids?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  unavailable_product_ids?: string;

  @IsNotEmpty()
  @Field(() => Date)
  start_time!: Date;

  @IsNotEmpty()
  @Field(() => Date)
  expire_time!: Date;

  @IsNotEmpty()
  @Field(() => Int)
  status!: number;
}
