import gql from 'graphql-tag';

export const GET_AXS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    axs(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      items {
        id
        title
        slug
        description
        status
        createdAt
      }
    }
  }
`;

export const GET_AX = gql`
  query($id: Int!) {
    ax(id: $id) {
      id
      title
      slug
      description
      status
      createdAt
      updatedAt
    }
  }
`;
