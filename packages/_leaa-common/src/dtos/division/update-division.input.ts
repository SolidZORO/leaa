import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateDivisionInput {
  @IsOptional()
  @Field(() => Int, { nullable: true })
  code?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  province_code?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  city_code?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;
}
