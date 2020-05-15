import _ from 'lodash';
import qs from 'qs';
import animateScrollTo from 'animated-scroll-to';
import { QuerySortArr, QuerySort } from '@nestjsx/crud-request';
import { PaginationProps } from 'antd/es/pagination';
import { SortOrder, SorterResult } from 'antd/es/table/interface';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@leaa/dashboard/src/constants';
import { ITablePagination, ICrudListQueryParams } from '@leaa/dashboard/src/interfaces';
import { SCondition } from '@nestjsx/crud-request/lib/types';

export const transRouterPathToClassName = (routerPath: string): string =>
  routerPath
    .replace(/^\//, '') // remove ^/
    .replace(/\/\d+/g, '-item') // replace /444  ->  -item
    .replace(/\//g, '-'); // replace all /  ->  -

interface IMergeParamToUrlQuery {
  window: Window;
  params: {} | undefined;
  replace: boolean;
}

export const mergeUrlParamToUrlQuery = ({ window, params, replace }: IMergeParamToUrlQuery): string => {
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

export const transCurdQueryToCurdState = (curdQuery: ICrudListQueryParams | any): ICrudListQueryParams => {
  if (JSON.stringify(curdQuery) === '{}') return curdQuery;

  const curdState: ICrudListQueryParams | any = curdQuery;

  if (typeof curdQuery.fields !== 'undefined') curdState.fields = JSON.parse(curdQuery.fields);
  if (typeof curdQuery.search !== 'undefined') curdState.search = JSON.parse(curdQuery.search);
  if (typeof curdQuery.filter !== 'undefined') curdState.filter = JSON.parse(curdQuery.filter);
  if (typeof curdQuery.or !== 'undefined') curdState.or = JSON.parse(curdQuery.or);
  if (typeof curdQuery.join !== 'undefined') curdState.join = JSON.parse(curdQuery.join);
  if (typeof curdQuery.sort !== 'undefined') curdState.sort = JSON.parse(curdQuery.sort);

  if (typeof curdQuery.limit !== 'undefined') curdState.limit = Number(curdQuery.limit);
  if (typeof curdQuery.offset !== 'undefined') curdState.offset = Number(curdQuery.offset);
  if (typeof curdQuery.page !== 'undefined') curdState.page = Number(curdQuery.page);

  if (typeof curdQuery.resetCache !== 'undefined') curdState.resetCache = JSON.parse(curdQuery.resetCache);

  return curdState;
};

export const transCurdStateToCurdQuery = (curdState: ICrudListQueryParams | any): ICrudListQueryParams => {
  if (JSON.stringify(curdState) === '{}') return curdState;

  const curdQuery: ICrudListQueryParams | any = curdState;

  if (typeof curdState.fields !== 'undefined') curdQuery.fields = JSON.stringify(curdState.fields);
  if (typeof curdState.search !== 'undefined') curdQuery.search = JSON.stringify(curdState.search);
  if (typeof curdState.filter !== 'undefined') curdQuery.filter = JSON.stringify(curdState.filter);
  if (typeof curdState.or !== 'undefined') curdQuery.or = JSON.stringify(curdState.or);
  if (typeof curdState.join !== 'undefined') curdQuery.join = JSON.stringify(curdState.join);
  if (typeof curdState.sort !== 'undefined') curdQuery.sort = JSON.stringify(curdState.sort);
  if (typeof curdState.resetCache !== 'undefined') curdQuery.resetCache = JSON.stringify(curdState.resetCache);

  return curdQuery;
};

export const transUrlQueryToCurdState = (window: Window): ICrudListQueryParams => {
  const urlObject = qs.parse(window.location.search, { ignoreQueryPrefix: true });

  return transCurdQueryToCurdState(urlObject);
};

export const transCurdStateToUrlQuery = (
  curdState: ICrudListQueryParams | any,
  qsOptions?: qs.IStringifyOptions,
): string => {
  const curdQuery = transCurdStateToCurdQuery(curdState);

  return qs.stringify(curdQuery, qsOptions);
};

interface ISetCurdQueryToUrl {
  window: Window;
  query: ICrudListQueryParams | undefined;
  replace?: boolean;
}

export const setCurdQueryToUrl = ({ window, query, replace }: ISetCurdQueryToUrl): string => {
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const urlObject = qs.parse(window.location.search, { ignoreQueryPrefix: true });

  const nextQuery = transCurdStateToUrlQuery({ ...urlObject, ...query }, { addQueryPrefix: true });
  const nextUrl = `${baseUrl}${nextQuery}`;

  if (replace) {
    window.history.pushState(null, '', nextUrl);
  }

  animateScrollTo(0);

  return nextUrl;
};

export const genFuzzySearchByQ = (
  q?: string,
  options?: { type: '$or' | '$and'; fields: string[] },
): SCondition | undefined => {
  if (!q) return undefined;
  if (!options) throw Error('genFuzzySearchByQ Missing params `options`.');

  const { type, fields } = options;

  const cFields = fields.reduce((acc: any[], cur) => {
    return acc.concat({ [cur]: { $cont: q } });
  }, []);

  // return condition e.g. { $or: [{ module: { $cont: s } }, { account: { $cont: s } }] }

  return {
    [type]: cFields,
  };

  // const baseUrl = `${window.location.origin}${window.location.pathname}`;
  // const urlObject = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  //
  // const nextQuery = transCurdStateToUrlQuery({ ...urlObject, ...query }, { addQueryPrefix: true });
  // const nextUrl = `${baseUrl}${nextQuery}`;
  //
  // if (replace) {
  //   window.history.pushState(null, '', nextUrl);
  // }
  //
  // animateScrollTo(0);
  //
  // return nextUrl;
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

interface IGetPaginationResult {
  page: number;
  pageSize: number;
}

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

type IFormatOrderSortResult = 'DESC' | 'ASC' | undefined;

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

export const formatOrderSort = (
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

interface IPickPaginationResult {
  page?: number;
  pageSize?: number;
}

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

interface IPickOrderProps {
  field?: string;
  order?: SortOrder;
}

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

export const initPaginationStateByUrl = (urlParams: any): ITablePagination => {
  const urlPagination = getPaginationByUrl(urlParams);

  return {
    page: urlPagination.page,
    pageSize: urlPagination?.pageSize,
    orderBy: formatOrderByByUrl(urlParams.orderBy),
    orderSort: formatOrderSortByUrl(urlParams.orderSort),
  };
};
