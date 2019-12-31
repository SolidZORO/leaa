import gql from 'graphql-tag';

export const GET_SETTINGS = gql`
  query {
    settings {
      total
      items {
        id
        name
        slug
        type
        description
        options
        value
        sort
        private
        updated_at
      }
    }
  }
`;
