import gql from 'graphql-tag';

export const GET_PRODUCTS = gql`
  query(
    $page: Int
    $pageSize: Int
    $orderBy: String
    $orderSort: String
    $q: String
    $tagName: String
    $brandName: String
    $brandId: String
    $styleName: String
    $styleId: String
  ) {
    products(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      orderSort: $orderSort
      q: $q
      tagName: $tagName
      brandName: $brandName
      brandId: $brandId
      styleName: $styleName
      styleId: $styleId
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
        stock
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
        attachments {
          bannerMbList {
            url
          }
        }
        status
        created_at
        updated_at
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query($id: String!) {
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
      stock
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
