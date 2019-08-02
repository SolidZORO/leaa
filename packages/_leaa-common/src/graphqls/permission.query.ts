import gql from 'graphql-tag';

export const GET_PERMISSIONS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    permissions(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      items {
        id
        name
        slug
        slugGroup
        created_at
      }
    }
  }
`;

export const GET_PERMISSION = gql`
  query($id: Int!) {
    permission(id: $id) {
      id
      name
      slug
      created_at
      updated_at
    }
  }
`;
