import { IsOptional, IsNotEmpty, Length, IsEmail, IsPhoneNumber, ValidateIf } from 'class-validator';

export class UserCreateOneReq {
  @ValidateIf((e) => !e.email || e.email === '')
  @IsPhoneNumber('CN')
  phone?: string | null;

  @ValidateIf((e) => !e.phone || e.phone === '')
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @Length(1, 64)
  name?: string;

  @IsOptional()
  is_superuser?: number;

  @IsNotEmpty()
  @Length(6, 64)
  password!: string;

  status?: number;
  is_admin?: number;
  avatar_url?: string;
}
