import _ from 'lodash';
import animateScrollTo from 'animated-scroll-to';
import queryString, { ParsedQuery } from 'query-string';
import { PaginationProps } from 'antd/es/pagination';
import { SortOrder } from 'antd/es/table/interface';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@leaa/dashboard/src/constants';
import { ITablePagination } from '@leaa/dashboard/src/interfaces';

interface IMergeParamToUrlQuery {
  window: Window;
  params: {} | undefined;
  replace: boolean;
}

interface IGetPaginationResult {
  page: number;
  pageSize: number;
}

interface IPickPaginationResult {
  page?: number;
  pageSize?: number;
}

interface IPickOrderProps {
  field?: string;
  order?: SortOrder;
}

type IFormatOrderSortResult = 'DESC' | 'ASC' | undefined;

export const routerPathToClassName = (routerPath: string): string =>
  routerPath
    .replace(/^\//, '') // remove ^/
    .replace(/\/\d+/g, '-item') // replace /444  ->  -item
    .replace(/\//g, '-'); // replace all /  ->  -

export const mergeParamToUrlQuery = ({ window, params, replace }: IMergeParamToUrlQuery): string => {
  const prevBaseUrl = `${window.location.origin}${window.location.pathname}`;
  const query = queryString.parse(window.location.search);

  const paramsObject = {
    ...query,
    ...params,
  };

  let nextUrl = prevBaseUrl;

  let paramsString = '';

  if (paramsObject) {
    paramsString = queryString.stringify(paramsObject);
  }

  nextUrl += `${paramsString ? '?' : ''}${paramsString}`;

  if (replace) {
    window.history.pushState(null, '', nextUrl);
  }

  animateScrollTo(0);

  return nextUrl;
};

export const getPaginationByUrl = (urlParams: ParsedQuery): IGetPaginationResult => {
  const result: IGetPaginationResult = {
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  };

  if (urlParams.page) {
    result.page = Number(urlParams.page);
  }

  if (urlParams.pageSize) {
    result.pageSize = Number(urlParams.pageSize);
  }

  return result;
};

export const formatOrderSortByUrl = (orderSort?: string[] | string | null | undefined): IFormatOrderSortResult => {
  if (!orderSort) {
    return undefined;
  }

  const result = String(orderSort).toLowerCase();

  if (['desc', 'descend'].includes(result)) {
    return 'DESC';
  }

  if (['asc', 'ascend'].includes(result)) {
    return 'ASC';
  }

  return undefined;
};

export const formatOrderByByUrl = (orderBy?: string[] | string | null | undefined): string | undefined => {
  if (!orderBy) {
    return undefined;
  }

  return String(orderBy);
};

export const pickPaginationByUrl = (params: PaginationProps): IPickPaginationResult => {
  if (_.isEmpty(params)) {
    return { page: undefined, pageSize: undefined };
  }

  const result: IPickPaginationResult = {};

  if (params.current) {
    result.page = params.current;
  }

  if (params.pageSize) {
    result.pageSize = params.pageSize;
  }

  return result;
};

// TODO EDIT TYPE
// const pickOrderByByUrl = (params: IPickOrderProps | any): IPickOrderResult => {
export const pickOrderByByUrl = (params: IPickOrderProps | any) => {
  if (_.isEmpty(params)) {
    return { orderBy: undefined, orderSort: undefined };
  }

  const result: any = {};

  if (params.field) {
    result.orderBy = params.field;
  }

  if (params.order) {
    result.orderSort = formatOrderSortByUrl(params.order);
  }

  return result;
};

export const initPaginationStateByUrl = (urlParams: ParsedQuery): ITablePagination => {
  const urlPagination = getPaginationByUrl(urlParams);

  return {
    page: urlPagination.page,
    pageSize: urlPagination?.pageSize,
    orderBy: formatOrderByByUrl(urlParams.orderBy),
    orderSort: formatOrderSortByUrl(urlParams.orderSort),
  };
};
