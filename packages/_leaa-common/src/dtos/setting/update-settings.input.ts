import { IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateSettingsInput {
  @IsNotEmpty()
  @Field(() => Int)
  id!: number;

  @IsNotEmpty()
  @Field(() => String)
  value!: string;
}
