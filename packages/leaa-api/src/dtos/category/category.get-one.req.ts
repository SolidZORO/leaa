import { BaseGetOneReq } from '@leaa/api/src/dtos/_common';
// import { FindOneOptions } from 'typeorm';
// import { Category } from '@leaa/api/src/entrys';

export class CategoryGetOneReq extends BaseGetOneReq {}
// export type CategoryGetOneReq = CategoryGetOneReq & FindOneOptions<Category>;

export type CategoriesQuery = {
  expanded?: boolean;
  parentSlug?: string;
  parentId?: string;
};
