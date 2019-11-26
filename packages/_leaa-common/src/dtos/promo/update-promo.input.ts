import { IsOptional } from 'class-validator';
import { Field, InputType, Int, Float } from 'type-graphql';

@InputType()
export class UpdatePromoInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  public type?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public name?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public quantity?: number;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  public amount?: number;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  public over_amount?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public available_product_ids?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public unavailable_product_ids?: string;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  public start_time?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  public expire_time?: Date;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public status?: number;
}
