import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTagInput {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  icon?: string;

  @IsOptional()
  description?: string;
}
