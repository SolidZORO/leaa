import { IsOptional, Length } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateArticleInput {
  @IsOptional()
  @Field(() => String)
  public title?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public slug?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public categoryId?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public userId?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public description?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public content?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public status?: number;
}
