import _ from 'lodash';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMount, useUpdateEffect } from 'react-use';

import { Role, Permission } from '@leaa/api/src/entrys';
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
  calcTableSortOrder,
} from '@leaa/dashboard/src/utils';
import { PageCard, HtmlMeta, TableCard, SearchInput } from '@leaa/dashboard/src/components';

import { RolePermissionLength } from '../_components/RolePermissionLength/RolePermissionLength';

import style from './style.module.less';

const API_PATH = 'roles';

export default (props: IPage) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCrudState(window),
  });

  const [listLoading, setListLoading] = useState(false);

  const [list, setList] = useState<ICrudListRes<Role>>();
  const [prmissions, setPrmissions] = useState<Permission[] | undefined>([]);

  const onFetchList = (params: ICrudListQueryParams) => {
    setCrudQuery(params);
    setListLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, { params: genCrudRequestQuery(params) })
      .then((res: IHttpRes<ICrudListRes<Role>>) => {
        setList(res.data.data);

        setCrudQueryToUrl({ window, query: params, replace: true });
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setListLoading(false));
  };

  const onFetchpPrmissions = () => {
    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/permissions`)
      .then((res: IHttpRes<ICrudListRes<Permission>>) => {
        setPrmissions(res.data.data?.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message));
  };

  useMount(() => {
    onFetchpPrmissions();
    onFetchList(crudQuery);
  });

  useUpdateEffect(() => {
    onFetchpPrmissions();
    onFetchList(crudQuery);
  }, [props.history.location.key]);

  useUpdateEffect(() => (!_.isEqual(crudQuery, DEFAULT_QUERY) ? onFetchList(crudQuery) : undefined), [crudQuery]);

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
                condition: { $and: [{ $or: [{ name: { $cont: q } }] }] },
                clear: { $and: [{ $or: undefined }] },
              }),
              q: q || undefined,
            });
          }}
        />
      }
      className={style['wapper']}
      loading={listLoading}
    >
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      {list?.data && (
        <TableCard
          crudQuery={crudQuery}
          setCrudQuery={setCrudQuery}
          route={props.route}
          routerName={API_PATH}
          columnFields={[
            'id',
            {
              title: t('_lang:name'),
              dataIndex: 'name',
              sorter: true,
              sortOrder: calcTableSortOrder('id', crudQuery.sort),
              render: (text: string, record: Role) => (
                <Link to={`${props.route.path}/${record.id}`}>
                  <span>
                    {record.name}{' '}
                    <sup>
                      <RolePermissionLength
                        rolePermissionsLength={record.permissions?.length}
                        allPermissionsLength={prmissions?.length}
                      />
                    </sup>
                  </span>
                </Link>
              ),
            },
            'slug',
            'createdAt',
            { action: { fieldName: 'name' } },
          ]}
          list={list}
        />
      )}
    </PageCard>
  );
};
