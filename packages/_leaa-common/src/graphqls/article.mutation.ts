import gql from 'graphql-tag';

export const CREATE_ARTICLE = gql`
  mutation($article: CreateArticleInput!) {
    createArticle(article: $article) {
      id
      title
      slug
      categoryId
      description
      content
      status
    }
  }
`;

export const UPDATE_ARTICLE = gql`
  mutation($id: Int!, $article: UpdateArticleInput!) {
    updateArticle(id: $id, article: $article) {
      id
      title
      slug
      categoryId
      description
      content
      status
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation($id: Int!) {
    deleteArticle(id: $id) {
      id
      title
      slug
    }
  }
`;
