import { Length, MinLength, IsEmail } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthSignupInput {
  @IsEmail()
  @MinLength(6)
  @Field(() => String)
  email!: string;

  @MinLength(4)
  @Field(() => String)
  name!: string;

  @Length(6, 64)
  @Field(() => String)
  password!: string;
}
