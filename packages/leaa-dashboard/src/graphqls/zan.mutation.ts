import gql from 'graphql-tag';

export const CREATE_ZAN = gql`
  mutation($zan: CreateZanInput!) {
    createZan(zan: $zan) {
      hashId
      title
      description
      status
    }
  }
`;

export const UPDATE_ZAN = gql`
  mutation($hashId: String!, $zan: UpdateZanInput!) {
    updateZan(hashId: $hashId, zan: $zan) {
      hashId
      title
      description
      status
    }
  }
`;

export const DELETE_ZAN = gql`
  mutation($hashId: String!) {
    deleteZan(hashId: $hashId) {
      hashId
      title
    }
  }
`;

export const LIKE_ZAN = gql`
  mutation($hashId: String!) {
    likeZan(hashId: $hashId) {
      hashId
      title
    }
  }
`;

export const DELETE_ZAN_USER = gql`
  mutation($hashId: String!, $userId: Int!) {
    deleteZanUser(hashId: $hashId, userId: $userId) {
      hashId
      title
    }
  }
`;
