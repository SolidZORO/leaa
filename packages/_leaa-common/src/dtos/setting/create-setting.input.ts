import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSettingInput {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  slug!: string;

  @IsNotEmpty()
  value!: string;

  @IsNotEmpty()
  type!: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  options?: string;

  @IsOptional()
  private?: number;

  @IsNotEmpty()
  sort!: number;
}
