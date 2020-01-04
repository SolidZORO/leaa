import gql from 'graphql-tag';

export const CREATE_ZAN = gql`
  mutation($zan: CreateZanInput!) {
    createZan(zan: $zan) {
      id
      uuid
      title
      description
      status
    }
  }
`;

export const UPDATE_ZAN = gql`
  mutation($id: Int!, $zan: UpdateZanInput!) {
    updateZan(id: $id, zan: $zan) {
      id
      uuid
      title
      description
      status
    }
  }
`;

export const DELETE_ZAN = gql`
  mutation($id: Int!) {
    deleteZan(id: $id) {
      id
      uuid
      title
    }
  }
`;
