import gql from 'graphql-tag';

export const GET_CATEGORIES = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    categories(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
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
`;

export const GET_CATEGORIES_BY_TREE = gql`
  query {
    categoriesByTree {
      treeByStringify
    }
  }
`;

export const GET_CATEGORY = gql`
  query($id: Int!) {
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
