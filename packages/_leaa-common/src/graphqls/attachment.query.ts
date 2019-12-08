import gql from 'graphql-tag';

export const GET_ATTACHMENTS = gql`
  query(
    $page: Int
    $pageSize: Int
    $orderBy: String
    $orderSort: String
    $q: String
    $type: String
    $moduleName: String
    $moduleId: Int
    $moduleType: String
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
      moduleName: $moduleName
      moduleId: $moduleId
      moduleType: $moduleType
      category_id: $category_id
      user_id: $user_id
      refreshHash: $refreshHash
    ) {
      total
      items {
        uuid
        title
        link
        type
        width
        height
        description
        category_id
        user_id
        module_name
        module_id
        module_type
        path
        url
        urlAt2x
        status
        sort
        at2x
        created_at
        updated_at
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
      width
      height
      description
      category_id
      user_id
      module_name
      module_id
      module_type
      path
      url
      urlAt2x
      status
      sort
      at2x
      created_at
      updated_at
    }
  }
`;
