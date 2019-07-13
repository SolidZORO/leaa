import gql from 'graphql-tag';

export const UPDATE_ATTACHMENT = gql`
  mutation($uuid: String!, $attachment: UpdateAttachmentInput!) {
    updateAttachment(uuid: $uuid, attachment: $attachment) {
      uuid
      title
      type
      description
      categoryId
      userId
      moduleName
      moduleId
      moduleType
      path
      status
      createdAt
    }
  }
`;

export const DELETE_ATTACHMENT = gql`
  mutation($uuid: String!) {
    deleteAttachment(uuid: $uuid) {
      uuid
      title
      type
      description
      categoryId
      userId
      moduleName
      moduleId
      moduleType
      path
      status
      createdAt
    }
  }
`;
