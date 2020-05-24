import { IsNotEmpty } from 'class-validator';
import { Category } from '@leaa/common/src/entrys';

export class CreateCategoryInput {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  slug!: string;

  parent_id?: string | null;

  description?: string;

  parent?: Category | null;
}
