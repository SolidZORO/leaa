import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, Icon, message } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/src/constants';
import { GET_ROLES, DELETE_ROLE } from '@leaa/common/src/graphqls';
import { Role } from '@leaa/common/src/entrys';
import { IOrderSort } from '@leaa/common/src/dtos/_common';
import { RolesWithPaginationObject, RolesArgs } from '@leaa/common/src/dtos/role';
import { urlUtil, tableUtil } from '@leaa/dashboard/src/utils';
import { IPage } from '@leaa/dashboard/src/interfaces';

import {
  HtmlMeta,
  PageCard,
  ErrorCard,
  TableCard,
  SearchInput,
  TableColumnDate,
  TableColumnDeleteButton,
  TableColumnId,
} from '@leaa/dashboard/src/components';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = urlUtil.getPagination(urlParams);

  const [q, setQ] = useState<string | undefined>(urlParams && urlParams.q ? `${urlParams.q}` : undefined);
  const [page, setPage] = useState<number | undefined>(urlPagination.page);
  const [pageSize, setPageSize] = useState<number | undefined>(urlPagination.pageSize);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>([]);

  // sort
  const [orderBy, setOrderBy] = useState<string | undefined>(
    urlParams && urlParams.orderBy ? `${urlParams.orderBy}` : undefined,
  );

  const [orderSort, setOrderSort] = useState<IOrderSort | undefined>(
    urlParams && urlParams.orderSort ? urlUtil.formatOrderSort(`${urlParams.orderSort}`) : undefined,
  );

  // query
  const getRolesVariables = { page, pageSize, q, orderBy, orderSort };
  const getRolesQuery = useQuery<{ roles: RolesWithPaginationObject }, RolesArgs>(GET_ROLES, {
    variables: getRolesVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [deleteRoleMutate, deleteRoleMutation] = useMutation<Role>(DELETE_ROLE, {
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_ROLES, variables: getRolesVariables }],
  });

  const resetUrlParams = () => {
    setPage(urlPagination.page);
    setPageSize(urlPagination.pageSize);
    setOrderBy(undefined);
    setOrderSort(undefined);
    setQ(undefined);
  };

  useEffect(() => {
    if (_.isEmpty(urlParams)) {
      resetUrlParams();
    }
  }, [urlParams]);

  const rowSelection = {
    columnWidth: 30,
    onChange: (keys: number[] | string[]) => setSelectedRowKeys(keys),
    selectedRowKeys,
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'id'),
      render: (text: string) => <TableColumnId id={text} />,
    },
    {
      title: t('_lang:name'),
      dataIndex: 'name',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'name'),
      render: (text: string, record: Role) => <Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>,
    },
    {
      title: t('_lang:slug'),
      dataIndex: 'slug',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'slug'),
    },
    {
      title: t('_lang:created_at'),
      dataIndex: 'created_at',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'created_at'),
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
          onClick={async () => deleteRoleMutate({ variables: { id: Number(record.id) } })}
        />
      ),
    },
  ];

  return (
    <PageCard
      title={
        <span>
          <strong>{t(`${props.route.namei18n}`)}</strong>
          <Link to={`${props.route.path}/create`}>
            <Icon type="plus" />
          </Link>
        </span>
      }
      extra={
        <SearchInput
          value={q}
          onChange={(keyword: string) => {
            setPage(1);
            setQ(keyword);

            urlUtil.mergeParamToUrlQuery({
              window,
              params: {
                page: 1,
                q: keyword,
              },
              replace: true,
            });
          }}
        />
      }
      className={style['wapper']}
      loading={getRolesQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getRolesQuery.error ? <ErrorCard error={getRolesQuery.error} /> : null}
      {deleteRoleMutation.error ? <ErrorCard error={deleteRoleMutation.error} /> : null}

      {getRolesQuery.data && getRolesQuery.data.roles && getRolesQuery.data.roles.items && (
        <TableCard selectedRowKeys={selectedRowKeys}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={getRolesQuery.data.roles.items}
            pagination={{
              defaultCurrent: page,
              defaultPageSize: pageSize,
              total: getRolesQuery.data.roles.total,
              current: page,
              pageSize,
              //
              pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
              showSizeChanger: true,
            }}
            onChange={(pagination, filters, sorter) => {
              setPage(pagination.current);
              setPageSize(pagination.pageSize);
              setOrderBy(sorter.field);
              setOrderSort(urlUtil.formatOrderSort(sorter.order));
              setSelectedRowKeys([]);

              urlUtil.mergeParamToUrlQuery({
                window,
                params: {
                  ...urlUtil.pickPagination(pagination),
                  ...urlUtil.pickOrder(sorter),
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
