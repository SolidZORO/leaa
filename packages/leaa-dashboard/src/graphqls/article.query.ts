import gql from 'graphql-tag';

export const GET_ARTICLES = gql`
  query(
    $page: Int
    $pageSize: Int
    $orderBy: String
    $orderSort: String
    $q: String
    $tagName: String
    $categoryId: String
    $categoryName: String
  ) {
    articles(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      orderSort: $orderSort
      q: $q
      tagName: $tagName
      categoryId: $categoryId
      categoryName: $categoryName
    ) {
      total
      page
      nextPage
      pageSize
      items {
        id
        title
        slug
        description
        categories {
          id
          name
          slug
        }
        tags {
          id
          name
          description
        }
        user_id
        status
        released_at
        created_at
        updated_at
      }
    }
  }
`;

export const GET_ARTICLE = gql`
  query($id: String!) {
    article(id: $id) {
      id
      title
      slug
      content
      description
      categories {
        id
        name
        slug
      }
      tags {
        id
        name
        description
      }
      user_id
      status
      released_at
      created_at
      updated_at
    }
  }
`;

export const GET_ARTICLE_BY_SLUG = gql`
  query($slug: String!) {
    articleBySlug(slug: $slug) {
      id
      title
      slug
      content
      description
      categories {
        id
        name
        slug
      }
      tags {
        id
        name
        description
      }
      user_id
      status
      released_at
      created_at
      updated_at
    }
  }
`;
