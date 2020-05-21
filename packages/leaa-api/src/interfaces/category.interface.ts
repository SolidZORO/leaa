import { FindOneOptions } from 'typeorm';
import { CategoryArgs } from '@leaa/common/src/dtos/category';
import { Category } from '@leaa/common/src/entrys';

// export type ICategoriesQuery = CategoriesArgs & FindOneOptions<Category>;
export type ICategoriesQuery = {
  expanded?: boolean;
  parentSlug?: string;
  parentId?: string;
};
export type ICategoryArgs = CategoryArgs & FindOneOptions<Category>;
