import gql from 'graphql-tag';

export const GET_CATEGORIES = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    categories(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      items {
        id
        name
        slug
        parentId
        description
        createdAt
      }
    }
  }
`;

export const GET_CATEGORY = gql`
  query($id: Int!) {
    category(id: $id) {
      id
      name
      slug
      parentId
      description
      createdAt
      updatedAt
    }
  }
`;
