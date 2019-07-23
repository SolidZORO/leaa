import gql from 'graphql-tag';

export const ATTACHMENT_FRAGMENT = gql`
  fragment ATTACHMENT_FRAGMENT on Attachment {
    id
    createdAt
    updatedAt
    deletedAt
    uuid
    title
    alt
    type
    filename
    description
    link
    moduleName
    moduleId
    moduleType
    ext
    width
    height
    size
    path
    pathAt2x
    at2x
    inLocal
    inCloud
    categoryId
    userId
    sort
    status
  }
`;
