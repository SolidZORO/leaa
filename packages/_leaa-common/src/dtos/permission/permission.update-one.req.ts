import { IsOptional } from 'class-validator';

export class PermissionUpdateOneReq {
  @IsOptional()
  name?: string;

  @IsOptional()
  slug?: string;
}
