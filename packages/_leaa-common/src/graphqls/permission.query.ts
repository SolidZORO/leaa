import gql from 'graphql-tag';

// export const GET_PERMISSION = gql`
//   query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
//     permission(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
//       items {
//         id
//         name
//         slug
//       }
//     }
//   }
// `;

export const GET_PERMISSIONS = gql`
  query {
    permissions {
      total
      items {
        id
        name
        slug
        slugGroup
      }
    }
  }
`;
