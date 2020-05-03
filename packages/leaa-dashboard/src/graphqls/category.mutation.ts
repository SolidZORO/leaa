import gql from 'graphql-tag';

export const CREATE_CATEGORY = gql`
  mutation($category: CreateCategoryInput!) {
    createCategory(category: $category) {
      id
      name
      slug
      parent_id
      description
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation($id: String!, $category: UpdateCategoryInput!) {
    updateCategory(id: $id, category: $category) {
      id
      name
      slug
      parent_id
      description
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation($id: String!) {
    deleteCategory(id: $id) {
      id
      name
      slug
    }
  }
`;
