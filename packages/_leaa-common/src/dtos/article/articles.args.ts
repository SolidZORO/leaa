import { ItemsArgs } from '@leaa/common/src/dtos/_common';

export class ArticlesArgs extends ItemsArgs {
  tagName?: string;

  categoryName?: string;

  categoryId?: string;
}
