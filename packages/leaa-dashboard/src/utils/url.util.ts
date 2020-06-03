import _ from 'lodash';
import qs from 'qs';
import animateScrollTo from 'animated-scroll-to';
import { QuerySortArr, QuerySort } from '@nestjsx/crud-request';
import { PaginationProps } from 'antd/es/pagination';
import { SortOrder, SorterResult } from 'antd/es/table/interface';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@leaa/dashboard/src/constants';
import { ITablePagination } from '@leaa/dashboard/src/interfaces';

export function getUrlPath(w?: Window): string {
  const win = w || window;

  return `${win.location.origin}${win.location.pathname}`;
}

/**
 * /articles/123    -> articles-item
 * /articles/create -> articles-create
 */
export function transRouterPathToClassName(routerPath: string): string {
  return routerPath
    .replace(/^\//, '') //         remove ^/
    .replace(/\/\d+/g, '-item') // replace /444  ->  -item
    .replace(/\//g, '-'); //       replace all /  ->  -
}

interface IMergeParamToUrlQuery {
  window: Window;
  params: Record<string, unknown> | undefined;
  replace: boolean;
}

export function mergeUrlParamToUrlQuery({ window, params, replace }: IMergeParamToUrlQuery): string {
  const prevBaseUrl = `${window.location.origin}${window.location.pathname}`;
  const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });

  const paramsObject = {
    ...query,
    ...params,
  };

  let nextUrl = prevBaseUrl;

  let paramsString = '';

  if (paramsObject) {
    paramsString = qs.stringify(paramsObject, { addQueryPrefix: true });
  }

  nextUrl += `${paramsString ? '?' : ''}${paramsString}`;

  if (replace) {
    window.history.pushState(null, '', nextUrl);
  }

  animateScrollTo(0);

  return nextUrl;
}

interface IGetPaginationResult {
  page: number;
  pageSize: number;
}

export function getPaginationByUrl(urlParams: any): IGetPaginationResult {
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
}

type IFormatOrderSortResult = 'DESC' | 'ASC' | undefined;

export function formatOrderSortByUrl(orderSort?: string[] | string | null | undefined): IFormatOrderSortResult {
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
}

export function formatOrderSort(
  orderSort?: SorterResult<any>,
): QuerySort | QuerySortArr | Array<QuerySort | QuerySortArr> | undefined {
  if (!orderSort) {
    return undefined;
  }

  const field = orderSort.field || 'id';
  let order = orderSort.order || '';

  if (orderSort.order) {
    if (['desc', 'descend', 'DESC'].includes(orderSort.order)) order = 'DESC';
    if (['asc', 'ascend', 'ASC'].includes(orderSort.order)) order = 'ASC';
  }

  if (!order) return undefined;

  return [field, order] as QuerySortArr;
}

export function formatOrderByByUrl(orderBy?: string[] | string | null | undefined): string | undefined {
  if (!orderBy) {
    return undefined;
  }

  return String(orderBy);
}

interface IPickPaginationResult {
  page?: number;
  pageSize?: number;
}

export function pickPaginationByUrl(params: PaginationProps): IPickPaginationResult {
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
}

interface IPickOrderProps {
  field?: string;
  order?: SortOrder;
}

// TODO EDIT TYPE
// const pickOrderByByUrl = (params: IPickOrderProps | any): IPickOrderResult => {
export function pickOrderByByUrl(params: IPickOrderProps | any) {
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
}

export function initPaginationStateByUrl(urlParams: any): ITablePagination {
  const urlPagination = getPaginationByUrl(urlParams);

  return {
    page: urlPagination.page,
    pageSize: urlPagination?.pageSize,
    orderBy: formatOrderByByUrl(urlParams.orderBy),
    orderSort: formatOrderSortByUrl(urlParams.orderSort),
  };
}
