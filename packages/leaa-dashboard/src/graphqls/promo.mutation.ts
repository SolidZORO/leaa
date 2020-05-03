import gql from 'graphql-tag';

export const CREATE_PROMO = gql`
  mutation($promo: CreatePromoInput!) {
    createPromo(promo: $promo) {
      name
      amount
      quantity
      redeemed_quantity
      over_amount
      status
      start_time
      expire_time
      available_product_ids
      unavailable_product_ids
    }
  }
`;

export const UPDATE_PROMO = gql`
  mutation($id: String!, $promo: UpdatePromoInput!) {
    updatePromo(id: $id, promo: $promo) {
      id
      name
      quantity
      redeemed_quantity
      status
    }
  }
`;

export const DELETE_PROMO = gql`
  mutation($id: String!) {
    deletePromo(id: $id) {
      id
      name
    }
  }
`;
