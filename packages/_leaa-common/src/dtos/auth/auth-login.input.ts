import { Length, MinLength, IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AuthLoginInput {
  @Field()
  @IsEmail()
  @MinLength(6)
  email!: string;

  @Field()
  @Length(6, 64)
  password!: string;
}
