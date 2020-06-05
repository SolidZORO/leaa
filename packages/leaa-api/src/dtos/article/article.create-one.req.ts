import { IsNotEmpty, IsOptional } from 'class-validator';

export class ArticleCreateOneReq {
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  slug?: string;

  @IsOptional()
  categoryIds?: string[] | null;

  @IsOptional()
  user_id?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  content?: string;

  @IsNotEmpty()
  status!: number;
}
