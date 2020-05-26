import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePromoInput {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  quantity!: number;

  @IsOptional()
  redeemed_quantity?: number;

  @IsNotEmpty()
  amount!: number;

  @IsOptional()
  over_amount?: number;

  @IsOptional()
  available_product_ids?: string;

  @IsOptional()
  unavailable_product_ids?: string;

  @IsNotEmpty()
  start_time!: Date;

  @IsNotEmpty()
  expire_time!: Date;

  @IsNotEmpty()
  status!: number;
}
