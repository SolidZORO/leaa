import { IsOptional } from 'class-validator';

export class DivisionUpdateOneReq {
  @IsOptional()
  code?: number;

  @IsOptional()
  province_code?: number;

  @IsOptional()
  city_code?: number;

  @IsOptional()
  name?: string;
}
