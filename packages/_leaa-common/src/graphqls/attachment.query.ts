import gql from 'graphql-tag';

export const GET_ATTACHMENTS = gql`
  query(
    $page: Int
    $pageSize: Int
    $orderBy: String
    $orderSort: String
    $q: String
    $type: String
    $module_name: String
    $module_id: Int
    $module_type: String
    $category_id: Int
    $user_id: Int
    $refreshHash: Int
  ) {
    attachments(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      orderSort: $orderSort
      q: $q
      type: $type
      module_name: $module_name
      module_id: $module_id
      module_type: $module_type
      category_id: $category_id
      user_id: $user_id
      refreshHash: $refreshHash
    ) {
      items {
        uuid
        title
        link
        type
        description
        category_id
        user_id
        module_name
        module_id
        module_type
        path
        pathAt2x
        status
        sort
        at2x
        created_at
      }
    }
  }
`;

export const GET_ATTACHMENT = gql`
  query($uuid: String!) {
    attachment(uuid: $uuid) {
      uuid
      title
      link
      type
      description
      category_id
      user_id
      module_name
      module_id
      module_type
      path
      pathAt2x
      status
      sort
      at2x
      created_at
      updated_at
    }
  }
`;
