import { IsOptional, IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RedeemCouponInput {
  @IsNotEmpty()
  @Field(() => String)
  code!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  userId?: string;
}
