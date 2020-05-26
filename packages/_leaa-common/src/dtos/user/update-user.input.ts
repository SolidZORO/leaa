import { IsOptional, Length, MinLength, IsEmail, IsPhoneNumber } from 'class-validator';

export class UpdateUserInput {
  @IsOptional()
  @IsPhoneNumber('CN')
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MinLength(4)
  email?: string;

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

  // @IsOptional()
  //
  // roleSlugs?: string[];
}
