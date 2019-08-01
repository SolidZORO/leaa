import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateCategoryInput {
  @IsOptional()
  @Field(() => String)
  public name?: string;

  @IsOptional()
  @Field(() => String)
  public slug?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public parent_id?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public description?: string;
}
