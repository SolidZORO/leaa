import gql from 'graphql-tag';

export const GET_USERS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String) {
    users(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort) {
      total
      items {
        id
        name
        email
      }
    }
  }
`;
