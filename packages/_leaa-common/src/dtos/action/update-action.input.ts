import { IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateActionInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  account?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  user_id?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  diff?: string;
}
