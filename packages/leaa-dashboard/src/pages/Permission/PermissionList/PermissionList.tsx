import _ from 'lodash';
import cx from 'classnames';
import { CancelTokenSource } from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Permission } from '@leaa/api/src/entrys';
import { envConfig } from '@leaa/dashboard/src/configs';
import { DEFAULT_QUERY } from '@leaa/dashboard/src/constants';
import { IPage, ICrudListQueryParams, IHttpRes, ICrudListRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import {
  ajax,
  errorMsg,
  setCrudQueryToUrl,
  transUrlQueryToCrudState,
  genCrudRequestQuery,
  genCrudQuerySearch,
} from '@leaa/dashboard/src/utils';
import { PageCard, HtmlMeta, TableCard, SearchInput, FilterIcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

const API_PATH = 'permissions';

/**
 * @ideaNotes
 *
 * 因为 Permission 比较多，我就用次文件写注释把。
 *
 * 当前组件里的 `onFetchList` 不直接执行，而是等待参数 `crudQuery` 发生改 effect (副作用) 后再执行。
 * 所以在 `<TableCard>` / `<SearchInput>` 等地方都会设置 `crudQuery`。
 *
 * 而在 `onFetchList` 内部，又会把 `crudQuery` 转换成 queryString 挂在 URL 上。
 * 当用户 F5 刷新浏览器后，`crudQuery` 会从 URL 的 query 中取值，经过转换后设置到 `crudQuery` 上。并以此循环运作。
 */
export default (props: IPage) => {
  const { t } = useTranslation();

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCrudState(window),
  });

  const [mounted, setMounted] = useState(false);

  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState<ICrudListRes<Permission>>();

  const onFetchList = (params: ICrudListQueryParams) => {
    setCrudQuery(params);
    setListLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, {
        params: genCrudRequestQuery(params),
      })
      .then((res: IHttpRes<ICrudListRes<Permission>>) => {
        setList(res.data.data);

        setCrudQueryToUrl({ window, query: params, replace: true });
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setListLoading(false));
  };

  // Normal
  useEffect(() => {
    if (mounted && !_.isEqual(crudQuery, DEFAULT_QUERY)) onFetchList(crudQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crudQuery]);

  // Sidebar (Refresh)
  useEffect(() => {
    if (mounted) onFetchList(DEFAULT_QUERY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history.location.key]);

  // Init (1st)
  useEffect(() => {
    setMounted(true);
    onFetchList(crudQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageCard
      route={props.route}
      title="@LIST"
      extra={
        <div className="g-page-card-extra-filter-bar-wrapper">
          <FilterIcon crudQuery={crudQuery} clear={['q', 'search']} onClose={(query: any) => setCrudQuery(query)} />

          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={crudQuery.q}
            onSearch={(q?: string) => {
              return setCrudQuery({
                ...crudQuery,
                search: genCrudQuerySearch(q, {
                  crudQuery,
                  condition: {
                    $and: [{ $or: [{ slug: { $cont: q } }, { name: { $cont: q } }] }],
                  },
                  clear: { $and: [{ $or: undefined }] },
                }),
                q: q || undefined,
              });
            }}
          />
        </div>
      }
      className={style['wapper']}
      loading={listLoading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {list?.data && (
        <TableCard
          crudQuery={crudQuery}
          setCrudQuery={setCrudQuery}
          route={props.route}
          routerName={API_PATH}
          columnFields={['id', 'name', 'slug', 'createdAt', { action: { fieldName: 'name' } }]}
          list={list}
        />
      )}
    </PageCard>
  );
};
