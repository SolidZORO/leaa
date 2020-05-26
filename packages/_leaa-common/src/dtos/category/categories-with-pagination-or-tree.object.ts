import { Category } from '@leaa/common/src/entrys';
import { CategoryTreeObject } from '@leaa/common/src/dtos/category/category-tree.object';

export class CategoriesWithPaginationOrTreeObject {
  readonly page?: number;

  readonly pageSize?: number;

  readonly nextPage?: number | null;

  readonly itemsCount?: number;

  readonly total?: number;

  readonly items?: Category[] = [];

  readonly trees?: CategoryTreeObject[] = [];
}
