import gql from 'graphql-tag';

export const CREATE_DIVISION = gql`
  mutation($division: CreateDivisionInput!) {
    createDivision(division: $division) {
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

export const UPDATE_DIVISION = gql`
  mutation($id: String!, $division: UpdateDivisionInput!) {
    updateDivision(id: $id, division: $division) {
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

export const DELETE_DIVISION = gql`
  mutation($id: String!) {
    deleteDivision(id: $id) {
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

export const SYNC_DIVISION_TO_FILE = gql`
  mutation {
    syncDivisionToFile {
      status
    }
  }
`;
