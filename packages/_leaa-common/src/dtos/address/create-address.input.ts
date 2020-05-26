import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAddressInput {
  @IsNotEmpty()
  address!: string;

  @IsNotEmpty()
  province!: string;

  @IsNotEmpty()
  city!: string;

  @IsOptional()
  area?: string;

  @IsOptional()
  consignee!: string;

  @IsOptional()
  zip?: number;

  @IsOptional()
  phone?: string;

  @IsOptional()
  status?: number;
}
