import gql from 'graphql-tag';

export const CREATE_PERMISSION = gql`
  mutation($permission: CreatePermissionInput!) {
    createPermission(permission: $permission) {
      id
      name
      slug
    }
  }
`;

export const UPDATE_PERMISSION = gql`
  mutation($id: String!, $permission: UpdatePermissionInput!) {
    updatePermission(id: $id, permission: $permission) {
      id
      name
      slug
    }
  }
`;

export const DELETE_PERMISSION = gql`
  mutation($id: String!) {
    deletePermission(id: $id) {
      id
      name
      slug
    }
  }
`;
