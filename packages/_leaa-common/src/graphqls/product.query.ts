import gql from 'graphql-tag';

export const GET_PRODUCTS = gql`
  query(
    $page: Int
    $pageSize: Int
    $orderBy: String
    $orderSort: String
    $q: String
    $tagName: String
    $styleName: String
    $brandName: String
  ) {
    products(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      orderSort: $orderSort
      q: $q
      tagName: $tagName
      styleName: $styleName
      brandName: $brandName
    ) {
      total
      page
      nextPage
      pageSize
      items {
        id
        name
        fullname
        price
        cost_price
        market_price
        description
        content
        sort
        serial
        tags {
          id
          name
          description
        }
        styles {
          id
          name
        }
        brands {
          id
          name
        }
        status
        created_at
        updated_at
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query($id: Int!) {
    product(id: $id) {
      id
      name
      fullname
      price
      cost_price
      market_price
      description
      content
      serial
      sort
      tags {
        id
        name
        description
      }
      styles {
        id
        name
      }
      brands {
        id
        name
      }
      status
      created_at
      updated_at
    }
  }
`;
