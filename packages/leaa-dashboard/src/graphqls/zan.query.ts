import gql from 'graphql-tag';

export const GET_ZANS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    zans(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      items {
        id
        uuid
        views
        title
        description
        target_zan_quantity
        current_zan_quantity
        status
        users {
          name
          email
        }
        created_at
        updated_at
      }
    }
  }
`;

export const GET_ZAN = gql`
  query($uuid: String!) {
    zan(uuid: $uuid) {
      id
      uuid
      views
      title
      description
      target_zan_quantity
      current_zan_quantity
      status
      users {
        name
        email
      }
      created_at
      updated_at
    }
  }
`;
