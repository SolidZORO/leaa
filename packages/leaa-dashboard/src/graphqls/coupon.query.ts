import gql from 'graphql-tag';

export const GET_COUPONS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    coupons(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      items {
        id
        code
        type
        name
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
        redeem_method
        creator_id
        status
        created_at
        updated_at
        available
        canRedeem
      }
    }
  }
`;

export const GET_COUPON = gql`
  query($id: String!) {
    coupon(id: $id) {
      id
      code
      type
      name
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
      redeem_method
      creator_id
      status
      created_at
      updated_at
      available
      canRedeem
    }
  }
`;
