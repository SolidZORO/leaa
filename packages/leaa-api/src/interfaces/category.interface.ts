import { FindOneOptions } from 'typeorm';
import { CategoriesArgs, CategoryArgs } from '@leaa/common/src/dtos/category';
import { Category } from '@leaa/common/src/entrys';

export type ICategoriesArgs = CategoriesArgs & FindOneOptions<Category>;
export type ICategoryArgs = CategoryArgs & FindOneOptions<Category>;
