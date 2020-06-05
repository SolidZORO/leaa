import { IsNotEmpty, IsOptional } from 'class-validator';

export class TagCreateOneReq {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  icon?: string;

  @IsOptional()
  description?: string;
}
