import { IsOptional } from 'class-validator';

export class UpdatePermissionInput {
  @IsOptional()
  name?: string;

  @IsOptional()
  slug?: string;
}
