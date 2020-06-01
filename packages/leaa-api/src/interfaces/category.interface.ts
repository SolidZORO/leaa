import { FindOneOptions } from 'typeorm';
import { CategoryGetOneReq } from '@leaa/common/src/dtos/category';
import { Category } from '@leaa/common/src/entrys';

export type ICategoryArgs = CategoryGetOneReq & FindOneOptions<Category>;
