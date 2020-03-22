import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateDivisionInput {
  @IsNotEmpty()
  @Field(() => Int)
  code!: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  province_code?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  city_code?: number;

  @IsOptional()
  @Field(() => String)
  name!: string;
}
