import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
import { GET_ROLES, DELETE_ROLE, GET_PERMISSIONS } from '@leaa/dashboard/src/graphqls';

import { Role } from '@leaa/common/src/entrys';
import { RolesWithPaginationObject, RolesArgs } from '@leaa/common/src/dtos/role';
import { PermissionsWithPaginationObject, PermissionsArgs } from '@leaa/common/src/dtos/permission';
import { IPage, IKey, ITablePagination } from '@leaa/dashboard/src/interfaces';
import {
  mergeUrlParamToUrlQuery,
  getPaginationByUrl,
  pickPaginationByUrl,
  pickOrderByByUrl,
  formatOrderSortByUrl,
  formatOrderByByUrl,
  initPaginationStateByUrl,
  calcTableDefaultSortOrder,
  msg,
} from '@leaa/dashboard/src/utils';

import {
  Rcon,
  PageCard,
  HtmlMeta,
  TableCard,
  SearchInput,
  TableColumnId,
  TableColumnDate,
  TableColumnDeleteButton,
} from '@leaa/dashboard/src/components';

import { RolePermissionLength } from '../_components/RolePermissionLength/RolePermissionLength';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = getPaginationByUrl(urlParams);

  const [tablePagination, setTablePagination] = useState<ITablePagination>(initPaginationStateByUrl(urlParams));
  const [selectedRowKeys, setSelectedRowKeys] = useState<IKey[]>([]);

  // filter
  const [q, setQ] = useState<string | undefined>(urlParams.q ? String(urlParams.q) : undefined);

  // query
  const getRolesVariables = { ...tablePagination, q };
  const getRolesQuery = useQuery<{ roles: RolesWithPaginationObject }, RolesArgs>(GET_ROLES, {
    variables: getRolesVariables,
    fetchPolicy: 'network-only',
  });

  const getPermissionsVariables = { pageSize: 9999 };
  const getPermissionsQuery = useQuery<{ permissions: PermissionsWithPaginationObject }, PermissionsArgs>(
    GET_PERMISSIONS,
    {
      variables: getPermissionsVariables,
      fetchPolicy: 'network-only',
    },
  );

  // mutation
  const [deleteRoleMutate, deleteRoleMutation] = useMutation<Role>(DELETE_ROLE, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msg(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_ROLES, variables: getRolesVariables }],
  });

  const resetUrlParams = () => {
    setTablePagination({
      page: urlPagination.page,
      pageSize: urlPagination.pageSize,
      orderBy: undefined,
      orderSort: undefined,
    });

    setSelectedRowKeys([]);
    setQ(undefined);
  };

  useEffect(() => {
    if (_.isEmpty(urlParams)) resetUrlParams(); // change route reset url
  }, [props.history.location.key]);

  const rowSelection = {
    columnWidth: 30,
    onChange: (keys: IKey[]) => setSelectedRowKeys(keys),
    selectedRowKeys,
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 75, // ID
      sorter: true,
      sortOrder: calcTableDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'id'),
      render: (id: string) => <TableColumnId id={id} link={`${props.route.path}/${id}`} />,
    },
    {
      title: t('_lang:name'),
      dataIndex: 'name',
      sorter: true,
      sortOrder: calcTableDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'name'),
      render: (text: string, record: Role) => (
        <Link to={`${props.route.path}/${record.id}`}>
          <span>
            {record.name}{' '}
            <sup>
              <RolePermissionLength
                rolePermissionsLength={record.permissions?.length}
                allPermissionsLength={getPermissionsQuery.data?.permissions?.items?.length}
              />
            </sup>
          </span>
        </Link>
      ),
    },
    {
      title: t('_lang:slug'),
      dataIndex: 'slug',
      sorter: true,
      sortOrder: calcTableDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'slug'),
    },
    {
      title: t('_lang:createdAt'),
      dataIndex: 'created_at',
      width: 120,
      sorter: true,
      sortOrder: calcTableDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'created_at'),
      render: (text: string) => <TableColumnDate date={text} size="small" />,
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Role) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.name}
          loading={deleteRoleMutation.loading}
          onClick={async () => deleteRoleMutate({ variables: { id: record.id } })}
        />
      ),
    },
  ];

  const onFilter = (params: { field: string; value?: string | number | number[] }) => {
    setTablePagination({ ...tablePagination, page: 1 });

    const filterParams: { q?: string; categoryId?: number; brandId?: number; tagName?: string } = {};

    if (params.field === 'q') {
      const result = params.value ? String(params.value) : undefined;

      setQ(result);
      filterParams.q = result;
    }

    mergeUrlParamToUrlQuery({
      window,
      params: { page: 1, ...filterParams },
      replace: true,
    });
  };

  return (
    <PageCard
      title={
        <span>
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
          {props.route.canCreate && (
            <Link className="g-page-card-create-link" to={`${props.route.path}/create`}>
              <Rcon type={PAGE_CARD_TITLE_CREATE_ICON} />
            </Link>
          )}
        </span>
      }
      extra={
        <div className="g-page-card-extra-filter-bar-wrapper">
          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={q}
            onChange={(v) => onFilter({ field: 'q', value: v })}
          />
        </div>
      }
      className={style['wapper']}
      loading={getRolesQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getRolesQuery?.data?.roles?.items && (
        <TableCard selectedRowKeys={selectedRowKeys} totalLength={getRolesQuery.data.roles.total}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns as any}
            dataSource={getRolesQuery.data.roles.items}
            pagination={{
              defaultCurrent: tablePagination.page,
              defaultPageSize: tablePagination.pageSize,
              total: getRolesQuery.data.roles.total,
              current: tablePagination.page,
              pageSize: tablePagination.pageSize,
              //
              pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
              showSizeChanger: true,
            }}
            onChange={(pagination, filters, sorter: any) => {
              setTablePagination({
                ...tablePagination,
                page: pagination.current,
                pageSize: pagination.pageSize,
                orderBy: formatOrderByByUrl(sorter.field),
                orderSort: formatOrderSortByUrl(sorter.order),
              });

              mergeUrlParamToUrlQuery({
                window,
                params: {
                  ...pickPaginationByUrl(pagination),
                  ...pickOrderByByUrl(sorter),
                },
                replace: true,
              });
            }}
          />
        </TableCard>
      )}
    </PageCard>
  );
};
