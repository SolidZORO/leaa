import gql from 'graphql-tag';

export const GET_ROLES = gql`
  query($page: Int, $pageSize: Int) {
    roles(page: $page, pageSize: $pageSize) {
      items {
        id
        name
        slug
      }
    }
  }
`;
