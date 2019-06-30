import gql from 'graphql-tag';

export const GET_PERMISSIONS = gql`
  query {
    permissions {
      total
      items {
        id
        name
        slug
      }
    }
  }
`;
