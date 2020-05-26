import { IsNotEmpty, IsOptional } from 'class-validator';

import { User } from '@leaa/common/src/entrys';

export class CreateZanInput {
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  status?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  target_zan_quantity?: number;

  @IsOptional()
  creator?: User;
}
