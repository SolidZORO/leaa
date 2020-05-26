import { IsOptional, IsNotEmpty } from 'class-validator';

export class RedeemCouponInput {
  @IsNotEmpty()
  code!: string;

  @IsOptional()
  userId?: string;
}
