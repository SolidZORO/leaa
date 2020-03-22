import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateAxInput {
  @IsNotEmpty()
  @Field(() => String)
  title!: string;

  @IsNotEmpty()
  @Field(() => String)
  slug!: string;

  @IsNotEmpty()
  @Field(() => Int)
  status!: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;
}
