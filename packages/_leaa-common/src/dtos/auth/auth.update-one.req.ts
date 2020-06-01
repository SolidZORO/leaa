import { IsOptional } from 'class-validator';

export class AuthUpdateOneReq {
  @IsOptional()
  union_id?: string;

  @IsOptional()
  ticket?: string;

  @IsOptional()
  access_token?: string;

  @IsOptional()
  refresh_token?: string;

  @IsOptional()
  last_auth_at?: Date;

  @IsOptional()
  ticket_at?: Date;
}
