import { IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @IsNotEmpty()
  @Field(() => String)
  name!: string;

  @IsNotEmpty()
  @Field(() => String)
  slug!: string;

  @Field(() => Int, { nullable: true })
  parent_id?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}
