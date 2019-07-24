import gql from 'graphql-tag';

export const GET_USERS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    users(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      items {
        id
        name
        email
        status
        createdAt
      }
    }
  }
`;

export const GET_USER = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      name
      email
      createdAt
      updatedAt
      status
      permissions {
        id
        name
        slug
      }
      roles {
        id
        name
        slug
      }
    }
  }
`;

export const GET_USER_BY_TOKEN = gql`
  query($token: String!) {
    userByToken(token: $token) {
      id
      name
      email
      authToken
      authExpiresIn
      flatePermissions
    }
  }
`;

export const GET_RAM = gql`
  query {
    ram
  }
`;
