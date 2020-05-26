import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductInput {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  fullname?: string;

  @IsNotEmpty()
  serial!: string;

  @IsNotEmpty()
  price!: number;

  @IsOptional()
  cost_price?: number;

  @IsOptional()
  market_price?: number;

  @IsNotEmpty()
  status!: number;

  @IsNotEmpty()
  stock!: number;

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
