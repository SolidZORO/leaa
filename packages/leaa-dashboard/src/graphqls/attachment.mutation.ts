import gql from 'graphql-tag';

export const UPDATE_ATTACHMENT = gql`
  mutation($uuid: String!, $attachment: UpdateAttachmentInput!) {
    updateAttachment(uuid: $uuid, attachment: $attachment) {
      uuid
      title
      type
      description
      user_id
      module_name
      module_id
      type_name
      type_platform
      path
      status
      created_at
      updated_at
    }
  }
`;

export const UPDATE_ATTACHMENTS = gql`
  mutation($attachments: [UpdateAttachmentsInput!]!) {
    updateAttachments(attachments: $attachments) {
      items {
        uuid
        title
      }
    }
  }
`;

export const DELETE_ATTACHMENT = gql`
  mutation($uuid: [String!]!) {
    deleteAttachments(uuid: $uuid) {
      items
    }
  }
`;
