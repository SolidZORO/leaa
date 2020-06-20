import _ from 'lodash';
import cx from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMount, useUpdateEffect } from 'react-use';

import { Ax } from '@leaa/api/src/entrys';
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

const API_PATH = 'attachments';

export default (props: IPage) => {
  const { t } = useTranslation();

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCrudState(window),
  });

  const [list, setList] = useState<ICrudListRes<Ax>>();
  const [listLoading, setListLoading] = useState(false);
  const onFetchList = (params: ICrudListQueryParams) => {
    setCrudQuery(params);
    setListLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, { params: genCrudRequestQuery(params) })
      .then((res: IHttpRes<ICrudListRes<Ax>>) => {
        setList(res.data.data);

        setCrudQueryToUrl({ window, query: params, replace: true });
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setListLoading(false));
  };

  useMount(() => onFetchList(crudQuery));
  useUpdateEffect(() => onFetchList(DEFAULT_QUERY), [props.history.location.key]);
  useUpdateEffect(() => (!_.isEqual(crudQuery, DEFAULT_QUERY) ? onFetchList(crudQuery) : undefined), [crudQuery]);

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
                  condition: { $and: [{ $or: [{ alt: { $cont: q } }, { title: { $cont: q } }] }] },
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
          columnFields={[
            'id',
            'title',
            'createdAt',
            { byte: { fieldName: 'size' } },
            'status',
            { action: { fieldName: 'title' } },
          ]}
          list={list}
        />
      )}
    </PageCard>
  );
};
