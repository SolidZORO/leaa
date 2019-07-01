// for layout className of full-wrap className
import queryString from 'query-string';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@leaa/dashboard/constants';
import { PaginationProps } from 'antd/lib/pagination';

const routerPathToClassName = (routerPath: string): string =>
  routerPath
    .replace(/^\//, '') // remove ^/
    .replace(/\/\d+/g, '-item') // replace /444  ->  -item
    .replace(/\//g, '-'); // replace all /  ->  -

//
//

interface IMergeParamToUrlQuery {
  window: Window;
  params: {} | undefined;
  replace: boolean;
}

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

//
//

interface IGetPaginationResult {
  page: number;
  pageSize: number;
}

const getPagination = (window: Window): IGetPaginationResult => {
  const result: IGetPaginationResult = {
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  };

  const qs = queryString.parse(window.location.search);

  if (qs.page) {
    result.page = Number(qs.page);
  }

  if (qs.pageSize) {
    result.pageSize = Number(qs.pageSize);
  }

  return result;
};

//
//

interface IPickPaginationResult {
  page?: number;
  pageSize?: number;
}

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
