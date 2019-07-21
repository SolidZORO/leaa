import { IsOptional, Length } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateArticleInput {
  @IsOptional()
  @Field(() => String)
  title?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  slug?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  userId?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  content?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  status?: number;
}
