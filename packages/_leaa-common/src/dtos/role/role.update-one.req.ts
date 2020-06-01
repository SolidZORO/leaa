import { IsOptional } from 'class-validator';

export class RoleUpdateOneReq {
  @IsOptional()
  name?: string;

  @IsOptional()
  slug?: string;

  @IsOptional()
  permissionIds?: string[];

  // @IsOptional()
  //
  // permissionSlugs?: string[];
}
