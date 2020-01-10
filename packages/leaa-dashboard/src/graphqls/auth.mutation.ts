import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation($user: AuthLoginInput!) {
    login(user: $user) {
      id
      name
      email
      avatar_url
      authToken
      authExpiresIn
      flatPermissions
    }
  }
`;

export const LOGIN_BY_TICKET = gql`
  mutation($ticket: String!) {
    loginByTicket(ticket: $ticket) {
      name
      email
      avatar_url
      authToken
      authExpiresIn
      flatPermissions
    }
  }
`;

export const DELETE_AUTH = gql`
  mutation($id: Int!) {
    deleteAuth(id: $id) {
      id
      open_id
    }
  }
`;
