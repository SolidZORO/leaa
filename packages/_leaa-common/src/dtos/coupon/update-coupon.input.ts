import { IsOptional } from 'class-validator';

export class UpdateCouponInput {
  @IsOptional()
  type?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  amount?: number;

  @IsOptional()
  over_amount?: number;

  @IsOptional()
  available_product_ids?: string;

  @IsOptional()
  unavailable_product_ids?: string;

  @IsOptional()
  start_time?: Date;

  @IsOptional()
  expire_time?: Date;

  @IsOptional()
  status?: number;
}
