import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { User } from '@leaa/api/src/entrys';
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
import { PageCard, HtmlMeta, TableCard, SearchInput, FilterIcon, NullTag } from '@leaa/dashboard/src/components';

import style from './style.module.less';

const API_PATH = 'users';

export default (props: IPage) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCrudState(window),
  });

  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState<ICrudListRes<User>>();

  const onFetchList = (params: ICrudListQueryParams) => {
    setCrudQuery(params);
    setListLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, { params: genCrudRequestQuery(params) })
      .then((res: IHttpRes<ICrudListRes<User>>) => {
        setList(res.data.data);

        setCrudQueryToUrl({ window, query: params, replace: true });
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setListLoading(false));
  };

  useEffect(() => {
    if (mounted) return;
    setMounted(true);
    onFetchList(crudQuery);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!_.isEqual(crudQuery, DEFAULT_QUERY)) {
      onFetchList(crudQuery);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crudQuery]);

  useEffect(() => {
    if (!mounted) return;
    onFetchList(DEFAULT_QUERY);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history.location.key]);

  return (
    <PageCard
      route={props.route}
      title="@LIST"
      extra={
        <div className="g-page-card-extra-filter-bar-wrapper">
          <FilterIcon
            crudQuery={crudQuery}
            clear={['q', 'search', 'categoryId']}
            onClose={(query: any) => setCrudQuery(query)}
          />

          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={crudQuery.q}
            onSearch={(q?: string) => {
              return setCrudQuery({
                ...crudQuery,
                search: genCrudQuerySearch(q, {
                  crudQuery,
                  condition: { $and: [{ $or: [{ name: { $cont: q } }] }] },
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
            'isAdmin',
            'avatar',
            {
              title: t('_lang:account'),
              width: 180,
              dataIndex: 'account',
              sorter: true,
              ellipsis: true,
              textWrap: 'word-break',
              render: (text: string, record: any) => {
                const accountColDom = [
                  <>{record.email || <NullTag nullText="----" />}</>,
                  <>{record.phone || <NullTag nullText="----" />}</>,
                ];

                if (envConfig.PRIMARY_ACCOUNT_TYPE === 'phone') accountColDom.reverse();

                return (
                  <Link to={`${props.route.path}/${record.id}`}>
                    <span>{accountColDom[0]}</span>
                    <br />
                    <small>{accountColDom[1]}</small>
                  </Link>
                );
              },
            },
            'roleList',
            'createdAt',
            'status',
            { action: { fieldName: 'name' } },
          ]}
          list={list}
        />
      )}
    </PageCard>
  );
};
