import { IsOptional } from 'class-validator';

export class UpdatePromoInput {
  @IsOptional()
  type?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  quantity?: number;

  @IsOptional()
  redeemed_quantity?: number;

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
