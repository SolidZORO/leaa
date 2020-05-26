import { IsOptional } from 'class-validator';

export class UpdateTagInput {
  @IsOptional()
  name?: string;

  @IsOptional()
  icon?: string;

  @IsOptional()
  description?: string;
}
