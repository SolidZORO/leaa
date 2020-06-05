import { IsNotEmpty } from 'class-validator';
import { Category } from '@leaa/api/src/entrys';

export class CategoryCreateOneReq {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  slug!: string;

  parent_id?: string | null;

  description?: string;

  parent?: Category | null;
}
