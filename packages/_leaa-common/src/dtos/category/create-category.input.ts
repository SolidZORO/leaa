import { IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  @IsNotEmpty()
  name!: string;

  @Field(() => String)
  @IsNotEmpty()
  slug!: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;
}
