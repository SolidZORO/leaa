import gql from 'graphql-tag';

export const GET_AUTHS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    auths(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      items {
        id
        open_id
        union_id
        app_id
        user_id
        platform
        ticket
        ticket_at
        access_token
        refresh_token
        nickname
        sex
        city
        province
        country
        avatar_url
        last_auth_at
        created_at
        updated_at
      }
    }
  }
`;
