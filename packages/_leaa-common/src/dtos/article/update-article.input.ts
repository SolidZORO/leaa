import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateArticleInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  title?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  slug?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  user_id?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  content?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  status?: number;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @IsOptional()
  @Field(() => [Int], { nullable: true })
  categoryIds?: number[] | null;

  @IsOptional()
  @Field(() => [Int], { nullable: true })
  tagIds?: number[] | null;
}
