import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      name
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation($id: Int!, $user: UpdateUserInput!) {
    updateUser(id: $id, user: $user) {
      id
      name
      email
    }
  }
`;
