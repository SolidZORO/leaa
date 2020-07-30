import _ from 'lodash';
import cx from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateEffect } from 'react-use';

import { Ax } from '@leaa/api/src/entrys';
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

const API_PATH = 'axs';

export default (props: IPage) => {
  const { t } = useTranslation();

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCrudState(window),
  });

  const list = useSWR<IFetchRes<ICrudListRes<Ax>>>(
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

  useUpdateEffect(() => {
    if (_.isEqual(crudQuery, DEFAULT_QUERY)) list.mutate();
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
                condition: { $and: [{ $or: [{ slug: { $cont: q } }, { title: { $cont: q } }] }] },
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
        columnFields={['id', 'title', 'slug', 'createdAt', 'status', { action: { fieldName: 'title' } }]}
        list={list.data?.data}
      />
    </PageCard>
  );
};
