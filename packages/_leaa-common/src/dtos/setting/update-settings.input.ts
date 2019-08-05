import { IsNotEmpty } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateSettingsInput {
  @IsNotEmpty()
  @Field(() => Int)
  public id!: number;

  @IsNotEmpty()
  @Field(() => String)
  public value!: string;
}
