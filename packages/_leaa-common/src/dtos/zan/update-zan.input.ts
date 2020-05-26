import { IsOptional } from 'class-validator';

export class UpdateZanInput {
  @IsOptional()
  title?: string;

  @IsOptional()
  status?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  target_zan_quantity?: number;

  @IsOptional()
  current_zan_quantity?: number;
}
