import { Length, MinLength, IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AuthLoginInput {
  @IsEmail()
  @MinLength(6)
  @Field()
  email!: string;

  @Length(6, 64)
  @Field()
  password!: string;
}
