import gql from 'graphql-tag';

export const GET_DEMO_DATA = gql`
  query {
    demoData {
      loginAccountByAdmin {
        password
        email
      }
    }
  }
`;
