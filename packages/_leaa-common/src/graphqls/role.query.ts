import gql from 'graphql-tag';

export const GET_ROLES = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    roles(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      items {
        id
        name
        slug
        created_at
      }
    }
  }
`;

export const GET_ROLE = gql`
  query($id: Int!) {
    role(id: $id) {
      id
      name
      slug
      created_at
      updated_at
      permissions {
        id
        name
        slug
      }
    }
  }
`;
