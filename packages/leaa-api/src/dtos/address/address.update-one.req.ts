import { IsOptional } from 'class-validator';

export class AddressUpdateOneReq {
  @IsOptional()
  address?: string;

  @IsOptional()
  province?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  area?: string;

  @IsOptional()
  consignee?: string;

  @IsOptional()
  zip?: number;

  @IsOptional()
  phone?: string;

  @IsOptional()
  status?: number;
}
