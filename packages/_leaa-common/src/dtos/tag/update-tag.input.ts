import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTagInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  icon?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;
}
