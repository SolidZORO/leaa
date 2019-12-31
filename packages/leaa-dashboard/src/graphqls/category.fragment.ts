import gql from 'graphql-tag';

export const CATEGORY_CHILD_FRAGMENT = gql`
  fragment CATEGORY_TREE_FRAGMENT on CategoryTreeObject {
    id
    title
    subtitle
    slug
    value
    parent_id
    description
    expanded
  }
`;
