import { Length, MinLength, IsEmail, IsOptional } from 'class-validator';

export class AuthLoginInput {
  @IsEmail()
  @MinLength(6)
  email!: string;

  @Length(6, 64)
  password!: string;

  @IsOptional()
  captcha?: string;

  @IsOptional()
  guestToken?: string;
}
