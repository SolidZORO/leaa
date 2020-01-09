import gql from 'graphql-tag';

export const GET_OAUTHS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    oauths(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
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
        last_oauth_at
        created_at
        updated_at
      }
    }
  }
`;
