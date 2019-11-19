import gql from 'graphql-tag';

export const GET_COUPONS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    coupons(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      items {
        id
        code
        type
        slug
        amount
        promo_id
        promo_code
        over_amount
        user_id
        order_id
        order_serial
        available_product_ids
        unavailable_product_ids
        start_time
        expire_time
        convert_method
        creator_id
        status
        created_at
      }
    }
  }
`;

export const GET_COUPON = gql`
  query($id: Int!) {
    coupon(id: $id) {
      id
      code
      type
      slug
      amount
      promo_id
      promo_code
      over_amount
      user_id
      order_id
      order_serial
      available_product_ids
      unavailable_product_ids
      start_time
      expire_time
      convert_method
      creator_id
      status
      created_at
      updated_at
    }
  }
`;
