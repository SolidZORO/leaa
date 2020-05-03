import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateArticleInput {
  @IsNotEmpty()
  @Field(() => String)
  title!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  slug?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  categoryIds?: string[] | null;

  @IsOptional()
  @Field(() => String, { nullable: true })
  user_id?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  content?: string;

  @IsNotEmpty()
  @Field(() => Int)
  status!: number;
}
