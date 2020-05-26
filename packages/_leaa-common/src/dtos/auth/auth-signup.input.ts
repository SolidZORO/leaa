import { Length, MinLength, IsEmail } from 'class-validator';

export class AuthSignupInput {
  @IsEmail()
  @MinLength(6)
  email!: string;

  @MinLength(4)
  name!: string;

  @Length(6, 64)
  password!: string;
}
