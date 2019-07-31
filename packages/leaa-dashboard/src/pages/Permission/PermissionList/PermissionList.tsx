import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, message } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/constants';
import { GET_PERMISSIONS, DELETE_PERMISSION } from '@leaa/common/graphqls';
import { Permission } from '@leaa/common/entrys';
import { IOrderSort } from '@leaa/common/dtos/_common';
import { PermissionsWithPaginationObject, PermissionArgs } from '@leaa/common/dtos/permission';
import { urlUtil, tableUtil } from '@leaa/dashboard/utils';
import { IPage } from '@leaa/dashboard/interfaces';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SearchInput } from '@leaa/dashboard/components/SearchInput';
import { TableCard } from '@leaa/dashboard/components/TableCard';
import { TableColumnId } from '@leaa/dashboard/components/TableColumnId';
import { TableColumnDate } from '@leaa/dashboard/components/TableColumnDate';
import { TableColumnDeleteButton } from '@leaa/dashboard/components/TableColumnDeleteButton';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = urlUtil.getPagination(urlParams);

  const [q, setQ] = useState<string | undefined>(urlParams && urlParams.q ? `${urlParams.q}` : undefined);
  const [page, setPage] = useState<number | undefined>(urlPagination.page);
  const [pageSize, setPageSize] = useState<number | undefined>(urlPagination.pageSize);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>([]);

  const [orderBy, setOrderBy] = useState<string | undefined>(
    urlParams && urlParams.orderBy ? `${urlParams.orderBy}` : undefined,
  );

  const [orderSort, setOrderSort] = useState<IOrderSort | undefined>(
    urlParams && urlParams.orderSort ? urlUtil.formatOrderSort(`${urlParams.orderSort}`) : undefined,
  );

  const resetUrlParams = () => {
    setPage(urlPagination.page);
    setPageSize(urlPagination.pageSize);
    setOrderBy(undefined);
    setOrderSort(undefined);
    setQ(undefined);
  };

  const getPermissionsVariables = { page, pageSize, q, orderBy, orderSort };
  const getPermissionsQuery = useQuery<{ permissions: PermissionsWithPaginationObject }, PermissionArgs>(
    GET_PERMISSIONS,
    {
      variables: getPermissionsVariables,
    },
  );

  useEffect(() => {
    if (_.isEmpty(urlParams)) {
      resetUrlParams();
    }
  }, [urlParams]);

  useEffect(() => {
    (async () => getPermissionsQuery.refetch())();
  }, [props.history.location.key]);

  const [deletePermissionMutate, deletePermissionMutation] = useMutation<Permission>(DELETE_PERMISSION, {
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_PERMISSIONS, variables: getPermissionsVariables }],
  });

  const rowSelection = {
    columnWidth: 30,
    onChange: (keys: number[] | string[]) => setSelectedRowKeys(keys),
    selectedRowKeys,
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50,
      render: (text: string) => <TableColumnId id={text} />,
    },
    {
      title: t('_lang:name'),
      dataIndex: 'name',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'name'),
      render: (text: string, record: Permission) => <Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>,
    },
    {
      title: t('_lang:slug'),
      dataIndex: 'slug',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'slug'),
    },
    {
      title: t('_lang:createdAt'),
      dataIndex: 'createdAt',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'createdAt'),
      render: (text: string) => <TableColumnDate date={text} size="small" />,
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 50,
      render: (text: string, record: Permission) => (
        <TableColumnDeleteButton
          id={record.id}
          loading={deletePermissionMutation.loading}
          onClick={async () => deletePermissionMutate({ variables: { id: Number(record.id) } })}
        />
      ),
    },
  ];

  return (
    <PageCard
      title={t(`${props.route.namei18n}`)}
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
      loading={getPermissionsQuery.loading}
    >
      {getPermissionsQuery.error ? <ErrorCard error={getPermissionsQuery.error} /> : null}
      {deletePermissionMutation.error ? <ErrorCard error={deletePermissionMutation.error} /> : null}

      {getPermissionsQuery.data && getPermissionsQuery.data.permissions && getPermissionsQuery.data.permissions.items && (
        <TableCard selectedRowKeys={selectedRowKeys}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={getPermissionsQuery.data.permissions.items}
            pagination={{
              defaultCurrent: page,
              defaultPageSize: pageSize,
              total: getPermissionsQuery.data.permissions.total,
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
