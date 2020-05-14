import _ from 'lodash';
import animateScrollTo from 'animated-scroll-to';
import queryString, { ParsedQuery } from 'query-string';
import qs from 'qs';
import { PaginationProps } from 'antd/es/pagination';
import { SortOrder, SorterResult, Key } from 'antd/es/table/interface';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@leaa/dashboard/src/constants';
import { ITablePagination, ICrudQueryParams } from '@leaa/dashboard/src/interfaces';
import { QuerySortArr, QuerySort, ParsedRequestParams, RequestQueryBuilder } from '@nestjsx/crud-request';

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

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

window.qs = qs;
// @ts-ignore
window.queryString = queryString;

export const curdQueryToCurdState = (curdQuery: ICrudQueryParams | any): ICrudQueryParams => {
  if (JSON.stringify(curdQuery) === '{}') return curdQuery;

  const curdState: ICrudQueryParams | any = curdQuery;

  if (typeof curdQuery.fields !== 'undefined') curdState.fields = JSON.parse(curdQuery.fields);
  if (typeof curdQuery.search !== 'undefined') curdState.search = JSON.parse(curdQuery.search);
  if (typeof curdQuery.filter !== 'undefined') curdState.filter = JSON.parse(curdQuery.filter);
  if (typeof curdQuery.or !== 'undefined') curdState.or = JSON.parse(curdQuery.or);
  if (typeof curdQuery.join !== 'undefined') curdState.join = JSON.parse(curdQuery.join);
  if (typeof curdQuery.sort !== 'undefined') curdState.sort = JSON.parse(curdQuery.sort);

  if (typeof curdQuery.limit !== 'undefined') curdState.limit = Number(curdQuery.limit);
  if (typeof curdQuery.offset !== 'undefined') curdState.offset = Number(curdQuery.offset);
  if (typeof curdQuery.page !== 'undefined') curdState.page = Number(curdQuery.page);

  return curdState;
};

export const curdStateToCurdQuery = (curdState: ICrudQueryParams | any): ICrudQueryParams => {
  if (JSON.stringify(curdState) === '{}') return curdState;

  const curdQuery: ICrudQueryParams | any = curdState;

  if (typeof curdState.fields !== 'undefined') curdQuery.fields = JSON.stringify(curdState.fields);
  if (typeof curdState.search !== 'undefined') curdQuery.search = JSON.stringify(curdState.search);
  if (typeof curdState.filter !== 'undefined') curdQuery.filter = JSON.stringify(curdState.filter);
  if (typeof curdState.or !== 'undefined') curdQuery.or = JSON.stringify(curdState.or);
  if (typeof curdState.join !== 'undefined') curdQuery.join = JSON.stringify(curdState.join);
  if (typeof curdState.sort !== 'undefined') curdQuery.sort = JSON.stringify(curdState.sort);

  return curdQuery;
};

export const urlToCurdState = (url: string): ICrudQueryParams => {
  return curdQueryToCurdState(queryString.parse(url));
};

export const curdStateToUrl = (curdState: ICrudQueryParams | any): string => {
  return queryString.stringify(curdStateToCurdQuery(curdState));
};

interface ISetCurdQueryToUrl {
  window: Window;
  query: ICrudQueryParams | undefined;
  replace?: boolean;
}

export const setCurdQueryToUrl = ({ window, query, replace }: ISetCurdQueryToUrl): string => {
  const { url, query: urlQuery } = queryString.parseUrl(window.location.href);

  const nextQuery = curdStateToUrl({
    ...urlQuery,
    ...query,
  });

  const nextUrl = `${url}${nextQuery ? '?' : ''}${nextQuery}`;
  // const nextUrl = queryString.stringifyUrl({ url, query: nextQuery }, { encode: false });
  console.log('nextQuery', nextQuery);
  console.log('nextUrl', nextUrl);
  console.log('url', url);

  if (replace) {
    window.history.pushState(null, '', nextUrl);
  }

  animateScrollTo(0);

  return nextUrl;
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

export const getPaginationByUrl = (urlParams: any): IGetPaginationResult => {
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

export const formatOrderSortByPagination = (
  orderSort?: SorterResult<any>,
): QuerySort | QuerySortArr | Array<QuerySort | QuerySortArr> | undefined => {
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
