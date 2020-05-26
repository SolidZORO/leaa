import { IsOptional } from 'class-validator';

export class CreateAuthInput {
  open_id!: string;

  @IsOptional()
  union_id?: string;

  app_id!: string;

  @IsOptional()
  user_id?: string;

  platform!: string;

  @IsOptional()
  ticket?: string;

  @IsOptional()
  ticket_at?: Date;

  @IsOptional()
  access_token?: string;

  @IsOptional()
  refresh_token?: string;

  nickname!: string;

  sex!: number;

  city!: string;

  province!: string;

  country!: string;

  avatar_url!: string;

  @IsOptional()
  last_auth_at?: Date;
}
