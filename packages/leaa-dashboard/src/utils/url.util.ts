import queryString, { ParsedQuery } from 'query-string';
import { PaginationProps } from 'antd/lib/pagination';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@leaa/dashboard/constants';

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

const routerPathToClassName = (routerPath: string): string =>
  routerPath
    .replace(/^\//, '') // remove ^/
    .replace(/\/\d+/g, '-item') // replace /444  ->  -item
    .replace(/\//g, '-'); // replace all /  ->  -

const mergeParamToUrlQuery = ({ window, params, replace }: IMergeParamToUrlQuery): string => {
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

  return nextUrl;
};

const getPagination = (urlParams: ParsedQuery): IGetPaginationResult => {
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

const pickPagination = (params: PaginationProps): IPickPaginationResult => {
  const result: IPickPaginationResult = {};

  if (params.current) {
    result.page = params.current;
  }

  if (params.pageSize) {
    result.pageSize = params.pageSize;
  }

  return result;
};

export const urlUtil = {
  routerPathToClassName,
  mergeParamToUrlQuery,
  pickPagination,
  getPagination,
};
