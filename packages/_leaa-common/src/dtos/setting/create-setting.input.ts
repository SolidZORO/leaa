import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateSettingInput {
  @IsNotEmpty()
  @Field(() => String)
  public name!: string;

  @IsNotEmpty()
  @Field(() => String)
  public slug!: string;

  @IsNotEmpty()
  @Field(() => String)
  public value!: string;

  @IsNotEmpty()
  @Field(() => String)
  public type!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public description?: string;

  @IsNotEmpty()
  @Field(() => Int, { defaultValue: 0 })
  public sort!: number;
}
