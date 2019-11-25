import { IsOptional, IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class ConvertCouponInput {
  @IsNotEmpty()
  @Field(() => String)
  public code!: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public userId?: number;
}
