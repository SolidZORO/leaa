import gql from 'graphql-tag';

export const ATTACHMENT_FRAGMENT = gql`
  fragment ATTACHMENT_FRAGMENT on Attachment {
    id
    created_at
    updated_at
    deleted_at
    uuid
    title
    alt
    type
    filename
    description
    link
    module_name
    module_id
    module_type
    ext
    width
    height
    size
    url
    urlAt2x
    path
    at2x
    in_local
    in_oss
    category_id
    user_id
    sort
    status
  }
`;
