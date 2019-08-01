import gql from 'graphql-tag';

// import { ATTACHMENT_FRAGMENT } from '@leaa/common/graphqls';
import { ATTACHMENT_FRAGMENT } from './attachment.fragment';

export const GET_AXS = gql`
  query($page: Int, $pageSize: Int, $orderBy: String, $orderSort: String, $q: String) {
    axs(page: $page, pageSize: $pageSize, orderBy: $orderBy, orderSort: $orderSort, q: $q) {
      items {
        id
        title
        slug
        description
        status
        created_at
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
          ...ATTACHMENT_FRAGMENT
        }
        bannerPcList {
          ...ATTACHMENT_FRAGMENT
        }
        galleryMbList {
          ...ATTACHMENT_FRAGMENT
        }
        galleryPcList {
          ...ATTACHMENT_FRAGMENT
        }
      }
    }
  }
  ${ATTACHMENT_FRAGMENT}
`;
