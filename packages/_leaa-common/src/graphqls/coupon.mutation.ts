import gql from 'graphql-tag';

export const CREATE_COUPON = gql`
  mutation($coupon: CreateCouponInput!) {
    createCoupon(coupon: $coupon) {
      slug
      amount
      over_amount
      status
      start_time
      expire_time
      available_product_ids
      unavailable_product_ids
    }
  }
`;

export const UPDATE_COUPON = gql`
  mutation($id: Int!, $coupon: UpdateCouponInput!) {
    updateCoupon(id: $id, coupon: $coupon) {
      id
      slug
      status
    }
  }
`;

export const DELETE_COUPON = gql`
  mutation($id: Int!) {
    deleteCoupon(id: $id) {
      id
      slug
    }
  }
`;
