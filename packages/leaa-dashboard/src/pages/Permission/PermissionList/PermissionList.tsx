import _ from 'lodash';
import cx from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateEffect } from 'react-use';

import { Permission } from '@leaa/api/src/entrys';
import { envConfig } from '@leaa/dashboard/src/configs';
import { DEFAULT_QUERY } from '@leaa/dashboard/src/constants';
import { IPage, ICrudListQueryParams, ICrudListRes, IFetchRes } from '@leaa/dashboard/src/interfaces';
import { useSWR } from '@leaa/dashboard/src/libs';
import {
  setCrudQueryToUrl,
  transUrlQueryToCrudState,
  genCrudRequestQuery,
  genCrudQuerySearch,
  httpErrorMsg,
} from '@leaa/dashboard/src/utils';
import { PageCard, HtmlMeta, TableCard, SearchInput } from '@leaa/dashboard/src/components';

import style from './style.module.less';

const API_PATH = 'permissions';

export default (props: IPage) => {
  const { t } = useTranslation();

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCrudState(window),
  });

  /**
   * @ideaNotes
   *
   * 因为 Permission 数据比较多，debug 的时候也是拿它调的，就用它来写注释把。
   *
   * 当前组件里的 `useSWR Hooks` 等待参数 `crudQuery` 发生变动后会自动执行，
   * 所以在 `<TableCard>` / `<SearchInput>` 等地方都会设置 `crudQuery`。
   *
   * 而 `crudQuery` 会转换成 queryString 挂在 URL 上，
   * 当用户 F5 刷新浏览器后，`crudQuery` 会从 URL 的 query 中取值，经过转换后设置到 `crudQuery` 上。并以此循环运作。
   */
  const list = useSWR<IFetchRes<ICrudListRes<Permission>>>(
    {
      url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`,
      params: genCrudRequestQuery(crudQuery),
      crudQuery,
    },
    {
      onError: httpErrorMsg,
      onSuccess: (res) => setCrudQueryToUrl({ window, query: res.config.crudQuery, replace: true }),
    },
  );

  // 每次切换路由 (react-router)，无聊是从 /abc 切换到 /123 还是从 /abc 切换到 /abc， 其 `location.key` 都会发生变化，
  // 此 key 是 SPA 里为数不多可以用来当 effect 的值，最后用默认的 `DEFAULT_QUERY` 去 featch。
  useUpdateEffect(() => {
    // 如果和 crudQuery 就是默认值，直接刷新一次
    if (_.isEqual(crudQuery, DEFAULT_QUERY)) list.mutate();
    // 否则，设定 crudQuery 为默认值，上面 useSWR 会自动触发执行
    else setCrudQuery(DEFAULT_QUERY);
  }, [props.history.location.key]);

  return (
    <PageCard
      route={props.route}
      title="@LIST"
      extra={
        <SearchInput
          className={cx('g-page-card-extra-search-input')}
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
      }
      className={style['page-card-wapper']}
      loading={list.loading}
    >
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <TableCard
        crudQuery={crudQuery}
        setCrudQuery={setCrudQuery}
        route={props.route}
        routerName={API_PATH}
        columnFields={['id', 'name', 'slug', 'createdAt', { action: { fieldName: 'name' } }]}
        list={list.data?.data}
      />
    </PageCard>
  );
};
