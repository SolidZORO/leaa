import _ from 'lodash';
import cx from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMount, useUpdateEffect } from 'react-use';

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

export default (props: IPage) => {
  const { t } = useTranslation();

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCrudState(window),
  });

  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState<ICrudListRes<Permission>>();

  /**
   * @ideaNotes
   *
   * 因为 Permission 数据比较多，debug 的时候也是拿它调的，就用它来写注释把。
   *
   * 当前组件里的 `onFetchList` 不直接执行，而是等待参数 `crudQuery` 发生改 effect (副作用) 后再执行，
   * 所以在 `<TableCard>` / `<SearchInput>` 等地方都会设置 `crudQuery`。
   *
   * 而在 `onFetchList` 内部，又会把 `crudQuery` 转换成 queryString 挂在 URL 上，
   * 当用户 F5 刷新浏览器后，`crudQuery` 会从 URL 的 query 中取值，经过转换后设置到 `crudQuery` 上。并以此循环运作。
   */
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

  /**
   * @ideaNotes
   *
   * 为了能够让用户 F5 刷新后，能把页面之前所有状态都通过 URL load 回来，着实需要做蛮多事情，我来说一下思路，为什么要这样写。
   *
   * List组件 一般会有几种情况需要刷新数据 (非页面)
   *
   * 1，第一次进来时 (Init)
   * 2，点击 Sidebar 时，刚好点中了当前 Page 的 Router，我点我自己，但 URL 没有变化 (Sidebar)
   * 3，改变分页等常规操作时 (Normal)
   */

  // 1️⃣ Init
  // 组件 init 进来，先设定为已加载，然后 fetch 数据
  useMount(() => {
    console.log('1️⃣ Init');
    onFetchList(crudQuery);
  });

  // 2️⃣ Sidebar
  // useEffectOnce
  // 每次切换路由 (react-router)，无聊是从 /abc 切换到 /123 还是从 /abc 切换到 /abc， 其 `location.key` 都会发生变化，
  // 此 key 是 SPA 里为数不多可以用来当 effect 的值，最后用默认的 `DEFAULT_QUERY` 去 featch。
  useUpdateEffect(() => {
    console.log('2️⃣ Sidebar');
    onFetchList(DEFAULT_QUERY);
  }, [props.history.location.key]);

  // 3️⃣ Normal
  // 每次 `crudQuery` 有 effect 时都会执行的 fetch 数据，除了 组件 init 的时候（因为 useUpdateEffect 不在 useMount 执行）
  // 后面那个 `!_.isEqual` 是什么意思呢？ 是因为 crudQuery 如果等于 DEFAULT_QUERY { page: 1, limit: 20 } 的情况下不体现在 URL :
  //
  // /permissions <---- equal ----> /permissions?page=1&limit=20
  //
  // 为什么不体现在 URL？因为我觉得没必要把默认参数也写出来，而且 react-router 跳到 /abc 还要再跳一次参数。
  useUpdateEffect(() => {
    if (!_.isEqual(crudQuery, DEFAULT_QUERY)) {
      console.log('3️⃣ Normal');
      onFetchList(crudQuery);
    }
  }, [crudQuery]);

  console.log(props.history.location.key);

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
