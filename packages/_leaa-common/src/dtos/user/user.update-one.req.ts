import { IsOptional, Length, IsEmail, ValidateIf, IsPhoneNumber } from 'class-validator';

export class UserUpdateOneReq {
  @ValidateIf((e) => !e.email || e.email === '')
  @IsOptional()
  @IsPhoneNumber('CN')
  phone?: string | null;
  //
  @ValidateIf((e) => !e.phone || e.phone === '')
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @Length(1, 64)
  name?: string;

  @IsOptional()
  @Length(6, 64)
  password?: string;

  @IsOptional()
  avatar_url?: string | null;

  @IsOptional()
  status?: number;

  @IsOptional()
  is_admin?: number;

  @IsOptional()
  roleIds?: string[];

  @IsOptional()
  last_login_ip?: string;

  @IsOptional()
  last_login_at?: Date;

  @IsOptional()
  last_token_at?: Date;

  @IsOptional()
  is_superuser?: number;

  // @IsOptional()
  //
  // roleSlugs?: string[];
}
