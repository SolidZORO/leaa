import _ from 'lodash';
import animateScrollTo from 'animated-scroll-to';
import queryString, { ParsedQuery } from 'query-string';
import { PaginationProps } from 'antd/lib/pagination';
import { SortOrder } from 'antd/lib/table';

// import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@leaa/dashboard/constants';

const calcDefaultSortOrder = (sort?: string, by?: string, field?: string): 'descend' | 'ascend' | boolean => {
  if (!by || !sort || !field) {
    return false;
  }

  if (by === field) {
    if (sort === 'DESC') {
      return 'descend';
    }
    if (sort === 'ASC') {
      return 'ascend';
    }
  }

  return false;
};

export const tableUtil = {
  calcDefaultSortOrder,
};
