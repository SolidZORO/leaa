import gql from 'graphql-tag';

export const GET_DIVISION = gql`
  query($id: Int!) {
    division(id: $id) {
      id
      name
      code
      province_code
      city_code
      created_at
      updated_at
    }
  }
`;

export const GET_DIVISIONS_MAPPING = gql`
  query {
    divisionsMapping
  }
`;

export const GET_DIVISIONS_TREE = gql`
  query {
    divisionsTree
  }
`;
