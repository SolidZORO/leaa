import { IsOptional } from 'class-validator';

export class ActionUpdateOneReq {
  @IsOptional()
  account?: string;

  @IsOptional()
  user_id?: string;

  @IsOptional()
  diff?: string;
}
