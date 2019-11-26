import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int, Float } from 'type-graphql';

@InputType()
export class CreatePromoInput {
  @IsNotEmpty()
  @Field(() => String)
  public name!: string;

  @IsNotEmpty()
  @Field(() => Int)
  public quantity!: number;

  @IsNotEmpty()
  @Field(() => Float)
  public amount!: number;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  public over_amount?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public available_product_ids?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public unavailable_product_ids?: string;

  @IsNotEmpty()
  @Field(() => Date)
  public start_time!: Date;

  @IsNotEmpty()
  @Field(() => Date)
  public expire_time!: Date;

  @IsNotEmpty()
  @Field(() => Int)
  public status!: number;
}
