import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateActionInput {
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  ip?: string;

  @IsNotEmpty()
  @Field(() => String)
  module!: string;

  @IsOptional()
  @Field(() => String)
  action?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  account?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  token?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  user_id?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  diff?: string;
}
