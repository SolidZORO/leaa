import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation($user: AuthLoginInput!) {
    login(user: $user) {
      id
      name
      email
      authToken
      authExpiresIn
      flatePermissions
    }
  }
`;

export const LOGIN_FOR_WWW = gql`
  mutation($user: AuthLoginInput!) {
    login(user: $user) {
      name
      email
      authToken
      authExpiresIn
    }
  }
`;
