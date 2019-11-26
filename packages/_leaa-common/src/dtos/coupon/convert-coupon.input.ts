import { IsOptional, IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class ConvertCouponInput {
  @IsNotEmpty()
  @Field(() => String)
  code!: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  userId?: number;
}
