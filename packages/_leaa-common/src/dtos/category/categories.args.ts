import { ItemsArgs } from '@leaa/common/src/dtos/_common';

export class CategoriesArgs extends ItemsArgs {
  expanded?: boolean;

  listType?: boolean;

  treeType?: boolean;

  parentSlug?: string;

  parentId?: string;

  // findDescendantsTree include parent category (default: parent.children)

  includeParent?: boolean;
}
