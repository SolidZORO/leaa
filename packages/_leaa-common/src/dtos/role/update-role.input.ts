import { IsOptional } from 'class-validator';

export class UpdateRoleInput {
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
