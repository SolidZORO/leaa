import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation($user: AuthLoginInput!) {
    login(user: $user) {
      name
      id
      authToken
      authExpiresIn
      flatePermissions
    }
  }
`;

