import gql from 'graphql-tag';

export const GET_USERS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    users(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      items {
        id
        name
        email
      }
    }
  }
`;

export const GET_USER = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      name
      email
      permissions {
        id
        name
      }
      roles {
        id
        name
      }
    }
  }
`;
