import _ from 'lodash';
import qs from 'qs';
import animateScrollTo from 'animated-scroll-to';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { DEFAULT_QUERY } from '@leaa/dashboard/src/constants';
import { ICrudListQueryParams } from '@leaa/dashboard/src/interfaces';
import { SCondition } from '@nestjsx/crud-request/lib/types';
import { errorMsg } from '@leaa/dashboard/src/utils/msg.util';

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
