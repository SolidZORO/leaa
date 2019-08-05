import gql from 'graphql-tag';

export const SETTING_FRAGMENT = gql`
  fragment SETTING_FRAGMENT on Setting {
    name
    slug
    type
    description
    options
    value
    sort
  }
`;
