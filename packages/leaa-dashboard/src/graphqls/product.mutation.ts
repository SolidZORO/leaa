import gql from 'graphql-tag';

export const CREATE_PRODUCT = gql`
  mutation($product: CreateProductInput!) {
    createProduct(product: $product) {
      id
      name
      fullname
      serial
      price
      cost_price
      market_price
      status
      sort
      description
      content
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation($id: String!, $product: UpdateProductInput!) {
    updateProduct(id: $id, product: $product) {
      id
      name
      fullname
      serial
      price
      cost_price
      market_price
      status
      sort
      description
      content
    }
  }
`;

export const UPDATE_PRODUCT_STATUS = gql`
  mutation($id: String!, $product: UpdateProductInput!) {
    updateProduct(id: $id, product: $product) {
      id
      name
      fullname
      serial
      price
      cost_price
      market_price
      status
      sort
      description
      content
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation($id: String!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;
