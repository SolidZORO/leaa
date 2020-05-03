import gql from 'graphql-tag';

export const CREATE_AX = gql`
  mutation($ax: CreateAxInput!) {
    createAx(ax: $ax) {
      id
      title
      slug
      description
      status
    }
  }
`;

export const UPDATE_AX = gql`
  mutation($id: String!, $ax: UpdateAxInput!) {
    updateAx(id: $id, ax: $ax) {
      id
      title
      slug
      description
      status
    }
  }
`;

export const DELETE_AX = gql`
  mutation($id: String!) {
    deleteAx(id: $id) {
      id
      title
      slug
    }
  }
`;
