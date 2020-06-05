import { BaseGetManyReq } from '@leaa/api/src/dtos/_common';

export class CategoryGetManyReq extends BaseGetManyReq {
  expanded?: boolean;

  listType?: boolean;

  treeType?: boolean;

  parentSlug?: string;

  parentId?: string;

  // findDescendantsTree include parent category (default: parent.children)

  includeParent?: boolean;
}
