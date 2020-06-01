import { FindOneOptions } from 'typeorm';
import { CategoryArgs } from '@leaa/common/src/dtos/category';
import { Category } from '@leaa/common/src/entrys';

export type ICategoryArgs = CategoryArgs & FindOneOptions<Category>;
