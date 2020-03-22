import { IsOptional, IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RedeemPromoInput {
  @IsNotEmpty()
  @Field(() => String)
  code!: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  userId?: number;
}
