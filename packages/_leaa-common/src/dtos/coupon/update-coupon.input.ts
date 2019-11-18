import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateCouponInput {
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
