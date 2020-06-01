import { IsOptional } from 'class-validator';

import { Category } from '@leaa/common/src/entrys';

export class CategoryUpdateOneReq {
  @IsOptional()
  name?: string;

  @IsOptional()
  slug?: string;

  @IsOptional()
  parent_id?: string | null;

  @IsOptional()
  description?: string;

  // @IsOptional()
  parent?: Category | null;
}
