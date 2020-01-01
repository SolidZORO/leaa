import gql from 'graphql-tag';

// export const CREATE_TAG = gql`
//   mutation($tag: CreateTagInput!) {
//     createTag(tag: $tag) {
//       id
//       name
//       icon
//       description
//       created_at
//       updated_at
//     }
//   }
// `;
//
// export const UPDATE_TAG = gql`
//   mutation($id: Int!, $tag: UpdateTagInput!) {
//     updateTag(id: $id, tag: $tag) {
//       id
//       name
//       icon
//       description
//       created_at
//       updated_at
//     }
//   }
// `;
//
// export const DELETE_TAG = gql`
//   mutation($id: Int!) {
//     deleteTag(id: $id) {
//       id
//       name
//       icon
//       description
//       created_at
//       updated_at
//     }
//   }
// `;

export const SYNC_DIVISION_TO_FILE = gql`
  mutation {
    syncDivisionToFile {
      status
    }
  }
`;
