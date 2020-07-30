import _ from 'lodash';
import cx from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateEffect } from 'react-use';

import { Article } from '@leaa/api/src/entrys';
import { envConfig } from '@leaa/dashboard/src/configs';
import { DEFAULT_QUERY } from '@leaa/dashboard/src/constants';
import { IPage, ICrudListQueryParams, ICrudListRes, IFetchRes } from '@leaa/dashboard/src/interfaces';
import {
  setCrudQueryToUrl,
  transUrlQueryToCrudState,
  genCrudRequestQuery,
  genCrudQuerySearch,
  httpErrorMsg,
} from '@leaa/dashboard/src/utils';
import { useSWR } from '@leaa/dashboard/src/libs';
import { PageCard, HtmlMeta, TableCard, SearchInput, SelectCategoryIdByTree } from '@leaa/dashboard/src/components';

import style from './style.module.less';

const API_PATH = 'articles';

export default (props: IPage) => {
  const { t } = useTranslation();

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCrudState(window),
  });

  const list = useSWR<IFetchRes<ICrudListRes<Article>>>(
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
      className={style['page-card-wapper']}
      loading={list.loading}
      extra={
        <SearchInput
          className={cx('g-page-card-extra-search-input')}
          value={crudQuery.q}
          onSearch={(q?: string) => {
            return setCrudQuery({
              ...crudQuery,
              search: genCrudQuerySearch(q, {
                crudQuery,
                condition: { $and: [{ $or: [{ title: { $cont: q } }, { slug: { $cont: q } }] }] },
                clear: { $and: [{ $or: undefined }] },
              }),
              q: q || undefined,
            });
          }}
        />
      }
      filter={[
        {
          label: t('_lang:category'),
          content: (
            <SelectCategoryIdByTree
              componentProps={{ allowClear: true }}
              onChange={(cId?: string) => {
                setCrudQuery({
                  ...crudQuery,
                  search: genCrudQuerySearch(cId, {
                    crudQuery,
                    condition: { $and: [{ 'categories.id': { $eq: cId } }] },
                    clear: { $and: [{ 'categories.id': undefined }] },
                  }),
                  categoryId: cId || undefined,
                });
              }}
              value={crudQuery?.categoryId || undefined}
              parentSlug="articles"
            />
          ),
        },
      ]}
      filterCloseCallback={() => {
        setCrudQuery({
          ...crudQuery,
          filterbar: undefined,
          categoryId: undefined,
          search: {
            $and: [{ 'categories.id': undefined }],
          },
        });
      }}
    >
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <TableCard
        crudQuery={crudQuery}
        setCrudQuery={setCrudQuery}
        route={props.route}
        routerName={API_PATH}
        columnFields={['id', 'title', 'category', 'createdAt', 'status', { action: { fieldName: 'title' } }]}
        list={list.data?.data}
      />
    </PageCard>
  );
};
