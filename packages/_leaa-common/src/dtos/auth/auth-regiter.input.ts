import { Length, MinLength, IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AuthRegisterInput {
  @Field()
  @IsEmail()
  @MinLength(6)
  email!: string;

  @Field()
  @MinLength(4)
  name!: string;

  @Field()
  @Length(6, 64)
  password!: string;
}
