import gql from 'graphql-tag';

export const UPDATE_USER = gql`
  mutation($id: Int!, $user: UpdateUserInput!) {
    updateUser(id: $id, user: $user) {
      id
      name
    }
  }
`;
