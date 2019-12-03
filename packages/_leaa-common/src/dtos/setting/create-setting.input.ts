import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateSettingInput {
  @IsNotEmpty()
  @Field(() => String)
  name!: string;

  @IsNotEmpty()
  @Field(() => String)
  slug!: string;

  @IsNotEmpty()
  @Field(() => String)
  value!: string;

  @IsNotEmpty()
  @Field(() => String)
  type!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  options?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  private?: number;

  @IsNotEmpty()
  @Field(() => Int, { defaultValue: 0 })
  sort!: number;
}
