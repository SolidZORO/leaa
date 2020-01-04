import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateZanInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  title?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  status?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;
}
