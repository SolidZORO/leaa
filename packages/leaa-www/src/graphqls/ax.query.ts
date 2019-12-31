import gql from 'graphql-tag';

import { ATTACHMENT_FRAGMENT_FOR_WWW } from './attachment.fragment';

export const GET_AXS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    axs(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      total
      items {
        id
        title
        slug
        description
        status
        created_at
        updated_at
      }
    }
  }
`;

export const GET_AX = gql`
  query($id: Int!) {
    ax(id: $id) {
      id
      title
      slug
      description
      status
      created_at
      updated_at
    }
  }
`;

export const GET_AX_BY_SLUG = gql`
  query($slug: String!) {
    axBySlug(slug: $slug) {
      id
      title
      slug
      description
      status
      created_at
      updated_at
      attachments {
        bannerMbList {
          ...ATTACHMENT_FRAGMENT_FOR_WWW
        }
        bannerPcList {
          ...ATTACHMENT_FRAGMENT_FOR_WWW
        }
        galleryMbList {
          ...ATTACHMENT_FRAGMENT_FOR_WWW
        }
        galleryPcList {
          ...ATTACHMENT_FRAGMENT_FOR_WWW
        }
      }
    }
  }
  ${ATTACHMENT_FRAGMENT_FOR_WWW}
`;
