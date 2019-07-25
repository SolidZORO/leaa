import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateAxInput {
  @IsNotEmpty()
  @Field(() => String)
  public title!: string;

  @IsNotEmpty()
  @Field(() => String)
  public slug!: string;

  @IsNotEmpty()
  @Field(() => Int)
  public status!: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public description?: string;
}
