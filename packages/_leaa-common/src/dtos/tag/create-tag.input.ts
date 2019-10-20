import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateTagInput {
  @IsNotEmpty()
  @Field(() => String)
  name!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  icon?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;
}
