import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateSettingInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  slug?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  type?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  value?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  options?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  private?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  sort?: number;
}
