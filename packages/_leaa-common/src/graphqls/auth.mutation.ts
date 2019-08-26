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

export const LOGIN_BY_TICKET_FOR_WWW = gql`
  mutation($ticket: String!) {
    loginByTicket(ticket: $ticket) {
      name
      email
      authToken
      authExpiresIn
    }
  }
`;

export const SIGNUP_FOR_WWW = gql`
  mutation($user: AuthSignupInput!, $oid: Int) {
    signup(user: $user, oid: $oid) {
      id
      name
      email
      authToken
      authExpiresIn
    }
  }
`;
