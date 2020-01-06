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

export const LIKE_ZAN = gql`
  mutation($uuid: String!) {
    likeZan(uuid: $uuid) {
      id
      uuid
      title
    }
  }
`;
