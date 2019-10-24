import gql from 'graphql-tag';

export const GET_TAGS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    tags(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      page
      nextPage
      pageSize
      items {
        id
        name
        icon
        description
        count
        created_at
      }
    }
  }
`;

export const GET_TAG = gql`
  query($id: Int!) {
    tag(id: $id) {
      id
      name
      icon
      description
      count
      created_at
    }
  }
`;

export const GET_TAG_BY_NAME = gql`
  query($name: String!) {
    tagByName(name: $name) {
      id
      name
      icon
      description
      count
      created_at
    }
  }
`;
