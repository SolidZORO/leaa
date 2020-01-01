import gql from 'graphql-tag';

export const CREATE_ADDRESS = gql`
  mutation($address: CreateAddressInput!) {
    createAddress(address: $address) {
      id
      address
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation($id: Int!, $address: UpdateAddressInput!) {
    updateAddress(id: $id, address: $address) {
      id
      address
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation($id: Int!) {
    deleteAddress(id: $id) {
      id
      address
    }
  }
`;
