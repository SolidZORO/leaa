import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateAxInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  public title?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public slug?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public status?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public description?: string;
}
