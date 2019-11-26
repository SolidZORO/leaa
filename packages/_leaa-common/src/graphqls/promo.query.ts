import gql from 'graphql-tag';

export const GET_PROMOS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    promos(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      items {
        id
        name
        amount
        quantity
        redeemed_quantity
        over_amount
        available_product_ids
        unavailable_product_ids
        start_time
        expire_time
        creator_id
        status
        created_at
        available
      }
    }
  }
`;

export const GET_PROMO = gql`
  query($id: Int!) {
    promo(id: $id) {
      id
      name
      amount
      quantity
      redeemed_quantity
      over_amount
      available_product_ids
      unavailable_product_ids
      start_time
      expire_time
      creator_id
      status
      created_at
      updated_at
      available
    }
  }
`;
