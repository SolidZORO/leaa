import gql from 'graphql-tag';

export const GET_SETTINGS = gql`
  query {
    settings {
      total
      items {
        id
        name
        slug
        type
        description
        options
        value
        sort
      }
    }
  }
`;

// export const GET_SETTING_BY_SLUG = gql`
//   query($token: String!) {
//     settingBySlug(slug: $slug) {
//       id
//       name
//       slug
//       type
//       description
//       options
//       value
//       sort
//       created_at
//     }
//   }
// `;
