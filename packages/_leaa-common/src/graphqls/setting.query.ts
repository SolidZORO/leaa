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

export const GET_SETTINGS_FOR_WWW = gql`
  query {
    settings {
      total
      items {
        name
        slug
        value
        updated_at
      }
    }
  }
`;
