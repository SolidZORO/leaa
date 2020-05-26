import { ItemsArgs } from '@leaa/common/src/dtos/_common';

export class ProductsArgs extends ItemsArgs {
  tagName?: string;

  styleName?: string;

  brandName?: string;

  styleId?: string;

  brandId?: string;
}
