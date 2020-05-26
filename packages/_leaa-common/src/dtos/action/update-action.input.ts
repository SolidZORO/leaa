import { IsOptional } from 'class-validator';

export class UpdateActionInput {
  @IsOptional()
  account?: string;

  @IsOptional()
  user_id?: string;

  @IsOptional()
  diff?: string;
}
