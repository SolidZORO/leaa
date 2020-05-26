import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDivisionInput {
  @IsNotEmpty()
  code!: number;

  @IsOptional()
  province_code?: number;

  @IsOptional()
  city_code?: number;

  @IsOptional()
  name!: string;
}
