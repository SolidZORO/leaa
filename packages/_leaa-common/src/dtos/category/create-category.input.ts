import { IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateCategoryInput {
  @IsNotEmpty()
  @Field(() => String)
  name!: string;

  @IsNotEmpty()
  @Field(() => String)
  slug!: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}
