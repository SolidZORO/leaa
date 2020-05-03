import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      name
      email
      avatar_url
      is_admin
    }
  }
`;

export const UPDATE_USER = gql`
  mutation($id: String!, $user: UpdateUserInput!) {
    updateUser(id: $id, user: $user) {
      id
      name
      email
      avatar_url
      is_admin
    }
  }
`;

export const DELETE_USER = gql`
  mutation($id: String!) {
    deleteUser(id: $id) {
      id
      name
      email
      avatar_url
    }
  }
`;
