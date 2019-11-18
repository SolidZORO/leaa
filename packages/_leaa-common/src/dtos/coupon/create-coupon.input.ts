import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int, Float } from 'type-graphql';

@InputType()
export class CreateCouponInput {
  @IsNotEmpty()
  @Field(() => String)
  public type!: string;

  @IsNotEmpty()
  @Field(() => String)
  public slug!: string;

  @IsNotEmpty()
  @Field(() => Float)
  public amount!: number;

  @IsOptional()
  @Field(() => Float)
  public over_amount?: number;

  @IsOptional()
  @Field(() => Float)
  public available_product_ids?: string;

  @IsOptional()
  @Field(() => Float)
  public unavailable_product_ids?: string;

  @IsNotEmpty()
  @Field(() => Date, { nullable: true })
  public start_time?: Date;

  @IsNotEmpty()
  @Field(() => Date, { nullable: true })
  public expire_time?: Date;

  @IsNotEmpty()
  @Field(() => Int)
  public status!: number;
}
