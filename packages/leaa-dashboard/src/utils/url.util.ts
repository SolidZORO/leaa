import _ from 'lodash';
import qs from 'qs';
import animateScrollTo from 'animated-scroll-to';
import { QuerySortArr, QuerySort, RequestQueryBuilder } from '@nestjsx/crud-request';
import { PaginationProps } from 'antd/es/pagination';
import { SortOrder, SorterResult } from 'antd/es/table/interface';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_QUERY } from '@leaa/dashboard/src/constants';
import { ITablePagination, ICrudListQueryParams } from '@leaa/dashboard/src/interfaces';
import { SCondition } from '@nestjsx/crud-request/lib/types';
import { errorMsg } from '@leaa/dashboard/src/utils/msg.util';
import mockLink from 'apollo-link/lib/test-utils/mockLink';

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
  params: {} | undefined;
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

export function transCrudQueryToCrudState(crudQuery: ICrudListQueryParams | any): ICrudListQueryParams {
  if (JSON.stringify(crudQuery) === '{}') return crudQuery;

  const crudState: ICrudListQueryParams | any = crudQuery;

  if (typeof crudQuery.fields !== 'undefined') crudState.fields = JSON.parse(crudQuery.fields);
  if (typeof crudQuery.search !== 'undefined') crudState.search = JSON.parse(crudQuery.search);
  if (typeof crudQuery.filter !== 'undefined') crudState.filter = JSON.parse(crudQuery.filter);
  if (typeof crudQuery.or !== 'undefined') crudState.or = JSON.parse(crudQuery.or);
  if (typeof crudQuery.join !== 'undefined') crudState.join = JSON.parse(crudQuery.join);
  if (typeof crudQuery.sort !== 'undefined') crudState.sort = JSON.parse(crudQuery.sort);

  if (typeof crudQuery.limit !== 'undefined') crudState.limit = Number(crudQuery.limit);
  if (typeof crudQuery.offset !== 'undefined') crudState.offset = Number(crudQuery.offset);
  if (typeof crudQuery.page !== 'undefined') crudState.page = Number(crudQuery.page);

  if (typeof crudQuery.resetCache !== 'undefined') crudState.resetCache = JSON.parse(crudQuery.resetCache);

  return crudState;
}

export function transCrudStateToCrudQuery(crudState: ICrudListQueryParams | any): ICrudListQueryParams {
  if (JSON.stringify(crudState) === '{}') return crudState;

  const crudQuery: ICrudListQueryParams | any = crudState;

  if (typeof crudState.fields !== 'undefined') crudQuery.fields = JSON.stringify(crudState.fields);
  if (typeof crudState.search !== 'undefined') crudQuery.search = JSON.stringify(crudState.search);
  if (typeof crudState.filter !== 'undefined') crudQuery.filter = JSON.stringify(crudState.filter);
  if (typeof crudState.or !== 'undefined') crudQuery.or = JSON.stringify(crudState.or);
  if (typeof crudState.join !== 'undefined') crudQuery.join = JSON.stringify(crudState.join);
  if (typeof crudState.sort !== 'undefined') crudQuery.sort = JSON.stringify(crudState.sort);
  if (typeof crudState.resetCache !== 'undefined') crudQuery.resetCache = JSON.stringify(crudState.resetCache);

  return crudQuery;
}

export function transUrlQueryToCrudState(window: Window): ICrudListQueryParams {
  const urlObject = qs.parse(window.location.search, { ignoreQueryPrefix: true });

  return transCrudQueryToCrudState(urlObject);
}

export function transCrudStateToUrlQuery(
  crudState: ICrudListQueryParams | any,
  qsOptions?: qs.IStringifyOptions,
): string {
  const crudQuery = transCrudStateToCrudQuery(crudState);

  return qs.stringify(crudQuery, qsOptions);
}

interface ISetCrudQueryToUrl {
  window: Window;
  query: ICrudListQueryParams | undefined;
  replace?: boolean;
}

export function getUrlPath(w?: Window): string {
  const win = w || window;

  return `${win.location.origin}${win.location.pathname}`;
}

export function setCrudQueryToUrl({ window, query, replace }: ISetCrudQueryToUrl): string {
  const urlPath = getUrlPath(window);
  const urlObject = qs.parse(window.location.search, { ignoreQueryPrefix: true });

  const nextQuery = transCrudStateToUrlQuery({ ...urlObject, ...query }, { addQueryPrefix: true });
  const nextUrl = `${urlPath}${nextQuery}`;

  if (replace) {
    window.history.pushState(null, '', nextUrl);
  }

  animateScrollTo(0);

  return nextUrl;
}

export function genCrudRequestQuery(crudState: ICrudListQueryParams): ICrudListQueryParams | undefined {
  try {
    console.log(RequestQueryBuilder.create(crudState).queryObject);
    return RequestQueryBuilder.create(crudState).queryObject;
  } catch (err) {
    errorMsg(err.message);
    return DEFAULT_QUERY;
  }

  // return {};
}

/**
 * - IN
 *       {`kw`, {type: '$or', fields: ['module', 'account']}}
 *
 * - OUT
 *       { $or: [
 *         { module: { $cont: 'kw' } },
 *         { account: { $cont: 'kw' } }]
 *       }
 */
export function genFuzzySearchByQ(
  q?: string,
  options?: { type: '$or' | '$and'; fields: string[] },
): SCondition | undefined {
  if (!q) return undefined;
  if (!options) throw Error('genFuzzySearchByQ Missing params `options`.');

  const { type, fields } = options;

  const cFields = fields.reduce((acc: any[], cur) => {
    return acc.concat({ [cur]: { $cont: q } });
  }, []);

  return {
    [type]: cFields,
  };
}

/**
- IN
  (
    `web`
    {
      crudQuery,
      condition: { $and: [{ $or: [{ title: { $cont: 'web' } }, { slug: { $cont: 'web' } }] }] },
      clear: { $and: [{ $or: undefined }] },
    }
  )

- OUT
  {
    $and: [{
      'categories.id': { $eq: '859b5db0-0b16-4973-864c-9f7be81a33f0' },
      $or: [{ title: { $cont: 'web' } }, { slug: { $cont: 'web' } }],
    }],
  }
 */
export function genCrudQuerySearch(
  key?: string,
  options?: { crudQuery: ICrudListQueryParams; condition: SCondition; clear: SCondition },
): SCondition | undefined {
  const prevSearch: SCondition | undefined = options?.crudQuery?.search;

  const keepMergeUndefinedValue = (value: any, srcValue: any, k: string, object: any) => {
    if (srcValue === undefined) _.unset(object, k);
  };

  let nextSearch = key
    ? _.merge(prevSearch, options?.condition)
    : _.mergeWith(prevSearch, options?.clear, keepMergeUndefinedValue);

  nextSearch = _.pickBy(nextSearch, _.identity);

  return nextSearch as SCondition;
}

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
