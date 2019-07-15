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
    $categoryId: Int
    $userId: Int
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
      categoryId: $categoryId
      userId: $userId
      refreshHash: $refreshHash
    ) {
      items {
        uuid
        title
        link
        type
        description
        categoryId
        userId
        moduleName
        moduleId
        moduleType
        path
        status
        sort
        createdAt
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
      categoryId
      userId
      moduleName
      moduleId
      moduleType
      path
      status
      sort
      createdAt
      updatedAt
    }
  }
`;
