import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int} from 'type-graphql';

@InputType()
export class UpdateCategoryInput {
  @IsOptional()
  @Field(() => String)
  name?: string;

  @IsOptional()
  @Field(() => String)
  slug?: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}
