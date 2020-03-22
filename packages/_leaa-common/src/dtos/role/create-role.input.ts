import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput {
  @IsNotEmpty()
  @Field(() => String)
  name!: string;

  @IsNotEmpty()
  @Field(() => String)
  slug!: string;
}
