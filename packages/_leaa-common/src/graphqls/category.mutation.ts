import gql from 'graphql-tag';

export const CREATE_CATEGORY = gql`
  mutation($category: CreateCategoryInput!) {
    createCategory(category: $category) {
      id
      name
      slug
      parentId
      description
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation($id: Int!, $category: UpdateCategoryInput!) {
    updateCategory(id: $id, category: $category) {
      id
      name
      slug
      parentId
      description
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation($id: Int!) {
    deleteCategory(id: $id) {
      id
      name
      slug
    }
  }
`;
