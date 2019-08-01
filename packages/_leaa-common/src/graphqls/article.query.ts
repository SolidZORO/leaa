import gql from 'graphql-tag';

export const GET_ARTICLES = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    articles(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      items {
        id
        title
        slug
        content
        description
        category_id
        category {
          name
          slug
        }
        user_id
        status
        created_at
      }
    }
  }
`;

export const GET_ARTICLE = gql`
  query($id: Int!) {
    article(id: $id) {
      id
      title
      slug
      content
      description
      category_id
      category {
        name
        slug
      }
      user_id
      status
      created_at
      updated_at
    }
  }
`;
