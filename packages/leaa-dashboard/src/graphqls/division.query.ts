import gql from 'graphql-tag';

export const GET_DIVISIONS_MAPPING = gql`
  query {
    divisionsMapping
  }
`;
