import { Length, MinLength, IsEmail, IsOptional } from 'class-validator';

export class AuthLoginReq {
  // @IsEmail()
  // @MinLength(6)
  // email!: string;

  @MinLength(6)
  account!: string;

  @Length(6, 64)
  password!: string;

  @IsOptional()
  captcha?: string;

  @IsOptional()
  guestToken?: string;
}
