import gql from 'graphql-tag';

export const UPDATE_ATTACHMENT = gql`
  mutation($uuid: String!, $attachment: UpdateAttachmentInput!) {
    updateAttachment(uuid: $uuid, attachment: $attachment) {
      uuid
      title
      type
      description
      category_id
      user_id
      module_name
      module_id
      module_type
      path
      status
      created_at
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
