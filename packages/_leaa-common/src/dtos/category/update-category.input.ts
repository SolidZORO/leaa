import { IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateCategoryInput {
  @Field(() => String)
  @IsNotEmpty()
  name!: string;

  @Field(() => String)
  @IsNotEmpty()
  slug!: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}
