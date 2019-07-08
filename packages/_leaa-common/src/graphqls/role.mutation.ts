import gql from 'graphql-tag';

export const CREATE_ROLE = gql`
  mutation($role: CreateRoleInput!) {
    createRole(role: $role) {
      id
      name
      slug
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation($id: Int!, $role: UpdateRoleInput!) {
    updateRole(id: $id, role: $role) {
      id
      name
      slug
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation($id: Int!) {
    deleteRole(id: $id) {
      id
      name
      slug
    }
  }
`;
