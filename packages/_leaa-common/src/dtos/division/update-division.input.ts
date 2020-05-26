import { IsOptional } from 'class-validator';

export class UpdateDivisionInput {
  @IsOptional()
  code?: number;

  @IsOptional()
  province_code?: number;

  @IsOptional()
  city_code?: number;

  @IsOptional()
  name?: string;
}
