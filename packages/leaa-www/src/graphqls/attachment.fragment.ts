import gql from 'graphql-tag';

export const ATTACHMENT_FRAGMENT_FOR_WWW = gql`
  fragment ATTACHMENT_FRAGMENT_FOR_WWW on Attachment {
    id
    created_at
    uuid
    title
    alt
    type
    filename
    description
    link
    module_name
    module_id
    type_name
    type_platform
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
