import { IsOptional, IsNotEmpty } from 'class-validator';

export class RedeemPromoInput {
  @IsNotEmpty()
  code!: string;

  @IsOptional()
  userId?: string;
}
