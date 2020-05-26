import { IsOptional } from 'class-validator';

export class UpdateProductInput {
  @IsOptional()
  name?: string;

  @IsOptional()
  fullname?: string;

  @IsOptional()
  serial?: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  cost_price?: number;

  @IsOptional()
  market_price?: number;

  @IsOptional()
  status?: number;

  @IsOptional()
  stock?: number;

  @IsOptional()
  sort?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  brandIds?: string[] | null;

  @IsOptional()
  styleIds?: string[] | null;

  @IsOptional()
  tagIds?: string[] | null;

  @IsOptional()
  bannerIds?: string[] | null;
}
