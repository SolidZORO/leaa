import gql from 'graphql-tag';

export const CREATE_ZAN = gql`
  mutation($zan: CreateZanInput!) {
    createZan(zan: $zan) {
      id
      title
      description
      status
    }
  }
`;

export const UPDATE_ZAN = gql`
  mutation($id: String!, $zan: UpdateZanInput!) {
    updateZan(id: $id, zan: $zan) {
      id
      title
      description
      status
    }
  }
`;

export const DELETE_ZAN = gql`
  mutation($id: String!) {
    deleteZan(id: $id) {
      id
      title
    }
  }
`;

export const LIKE_ZAN = gql`
  mutation($id: String!) {
    likeZan(id: $id) {
      id
      title
    }
  }
`;

export const DELETE_ZAN_USER = gql`
  mutation($id: String!, $userId: String!) {
    deleteZanUser(id: $id, userId: $userId) {
      id
      title
    }
  }
`;
