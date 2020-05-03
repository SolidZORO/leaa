import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateSettingsInput {
  @IsNotEmpty()
  @Field(() => String)
  id!: string;

  @IsNotEmpty()
  @Field(() => String)
  value!: string;
}
