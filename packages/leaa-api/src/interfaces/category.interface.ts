import { FindOneOptions } from 'typeorm';
import { CategoryGetOneReq } from '@leaa/api/src/dtos/category';
import { Category } from '@leaa/api/src/entrys';

export type ICategoryArgs = CategoryGetOneReq & FindOneOptions<Category>;

export type ICategoriesQuery = {
  expanded?: boolean;
  parentSlug?: string;
  parentId?: string;
};
