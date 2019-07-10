import { Length, MinLength, IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AuthRegisterInput {
  @IsEmail()
  @MinLength(6)
  @Field()
  email!: string;

  @MinLength(4)
  @Field()
  name!: string;

  @Length(6, 64)
  @Field()
  password!: string;
}
