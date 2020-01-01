import gql from 'graphql-tag';

export const GET_ADDRESSES = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    addresses(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      items {
        id
        province
        city
        area
        consignee
        zip
        phone
        status
        address
        created_at
        updated_at
      }
    }
  }
`;

export const GET_ADDRESS = gql`
  query($id: Int!) {
    address(id: $id) {
      id
      province
      city
      area
      consignee
      zip
      phone
      status
      address
      created_at
      updated_at
    }
  }
`;
