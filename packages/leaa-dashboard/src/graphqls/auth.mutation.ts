import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation($user: AuthLoginInput!) {
    login(user: $user) {
      id
      name
      email
      avatar {
        url
        urlAt2x
      }
      authToken
      authExpiresIn
      flatPermissions
    }
  }
`;
