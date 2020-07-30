import _ from 'lodash';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateEffect } from 'react-use';

import { Role, Permission } from '@leaa/api/src/entrys';
import { envConfig } from '@leaa/dashboard/src/configs';
import { DEFAULT_QUERY } from '@leaa/dashboard/src/constants';
import { IPage, ICrudListQueryParams, ICrudListRes, IFetchRes } from '@leaa/dashboard/src/interfaces';
import { useSWR } from '@leaa/dashboard/src/libs';
import {
  setCrudQueryToUrl,
  transUrlQueryToCrudState,
  genCrudRequestQuery,
  genCrudQuerySearch,
  calcTableSortOrder,
  httpErrorMsg,
} from '@leaa/dashboard/src/utils';
import { PageCard, HtmlMeta, TableCard, SearchInput } from '@leaa/dashboard/src/components';

import { RolePermissionLength } from '../_components/RolePermissionLength/RolePermissionLength';

import style from './style.module.less';

const API_PATH = 'roles';

export default (props: IPage) => {
  const { t } = useTranslation();

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCrudState(window),
  });

  const list = useSWR<IFetchRes<ICrudListRes<Role>>>(
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

  const prmissions = useSWR<IFetchRes<ICrudListRes<Permission>>>(
    { url: `${envConfig.API_URL}/${envConfig.API_VERSION}/permissions` },
    { onError: httpErrorMsg },
  );

  useUpdateEffect(() => {
    if (_.isEqual(crudQuery, DEFAULT_QUERY)) {
      list.mutate();
      prmissions.mutate();
    } else setCrudQuery(DEFAULT_QUERY);
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
                condition: { $and: [{ $or: [{ name: { $cont: q } }] }] },
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
        route={props.route}
        routerName={API_PATH}
        crudQuery={crudQuery}
        setCrudQuery={setCrudQuery}
        //
        list={list.data?.data}
        mutate={list.mutate}
        //
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
                      allPermissionsLength={prmissions.data?.data?.data?.length}
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
      />
    </PageCard>
  );
};
