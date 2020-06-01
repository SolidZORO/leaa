import { IsOptional } from 'class-validator';

export class ArticleUpdateOneReq {
  @IsOptional()
  title?: string;

  @IsOptional()
  slug?: string;

  @IsOptional()
  user_id?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  status?: number;

  @IsOptional()
  released_at?: Date;

  @IsOptional()
  categoryIds?: string[] | null;

  @IsOptional()
  tagIds?: string[] | null;
}
