import { ItemArgs } from '@leaa/common/src/dtos/_common';
// import { FindOneOptions } from 'typeorm';
// import { Category } from '@leaa/common/src/entrys';

export class CategoryArgs extends ItemArgs {}
// export type CategoryArgs = CategoryArgs & FindOneOptions<Category>;

export type CategoriesQuery = {
  expanded?: boolean;
  parentSlug?: string;
  parentId?: string;
};
