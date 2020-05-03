import gql from 'graphql-tag';

import { CATEGORY_CHILD_FRAGMENT } from './category.fragment';

export const GET_CATEGORIES = gql`
  query(
    $page: Int
    $pageSize: Int
    $orderBy: String
    $orderSort: String
    $q: String
    $treeType: Boolean
    $listType: Boolean
    $expanded: Boolean
    $parentSlug: String
    $parentId: String
  ) {
    categories(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      orderSort: $orderSort
      q: $q
      treeType: $treeType
      listType: $listType
      expanded: $expanded
      parentSlug: $parentSlug
      parentId: $parentId
    ) {
      total
      trees {
        ...CATEGORY_TREE_FRAGMENT
        children {
          ...CATEGORY_TREE_FRAGMENT
          children {
            ...CATEGORY_TREE_FRAGMENT
            children {
              ...CATEGORY_TREE_FRAGMENT
              children {
                ...CATEGORY_TREE_FRAGMENT
                children {
                  ...CATEGORY_TREE_FRAGMENT
                  children {
                    ...CATEGORY_TREE_FRAGMENT
                    children {
                      ...CATEGORY_TREE_FRAGMENT
                      children {
                        ...CATEGORY_TREE_FRAGMENT
                        children {
                          ...CATEGORY_TREE_FRAGMENT
                          children {
                            ...CATEGORY_TREE_FRAGMENT
                            children {
                              ...CATEGORY_TREE_FRAGMENT
                              children {
                                ...CATEGORY_TREE_FRAGMENT
                                children {
                                  ...CATEGORY_TREE_FRAGMENT
                                  children {
                                    ...CATEGORY_TREE_FRAGMENT
                                    children {
                                      ...CATEGORY_TREE_FRAGMENT
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      items {
        id
        name
        slug
        parent_id
        description
        created_at
        updated_at
      }
    }
  }
  ${CATEGORY_CHILD_FRAGMENT}
`;

export const GET_CATEGORY = gql`
  query($id: String!) {
    category(id: $id) {
      id
      name
      slug
      parent_id
      description
      created_at
      updated_at
    }
  }
`;
