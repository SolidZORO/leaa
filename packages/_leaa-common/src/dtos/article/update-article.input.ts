import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateArticleInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  title?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  slug?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  user_id?: string;

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
  released_at?: Date;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  categoryIds?: string[] | null;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  tagIds?: string[] | null;
}
