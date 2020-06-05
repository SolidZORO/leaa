import { IsOptional } from 'class-validator';

export class TagUpdateOneReq {
  @IsOptional()
  name?: string;

  @IsOptional()
  icon?: string;

  @IsOptional()
  description?: string;
}
