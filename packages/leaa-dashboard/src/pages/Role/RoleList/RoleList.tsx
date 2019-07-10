import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, message } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/constants';
import { GET_ROLES, DELETE_ROLE } from '@leaa/common/graphqls';
import { Role } from '@leaa/common/entrys';
import { IOrderSort } from '@leaa/common/dtos/_common';
import { RolesObject, RolesArgs } from '@leaa/common/dtos/role';
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
  const [orderBy, setOrderBy] = useState<string | undefined>(urlParams && urlParams.orderBy ? `${urlParams.orderBy}` : undefined); // prettier-ignore
  const [orderSort, setOrderSort] = useState<IOrderSort | string | undefined>(urlParams && urlParams.orderSort ? urlUtil.formatOrderSort(`${urlParams.orderSort}`) : undefined); // prettier-ignore
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>([]);

  const resetUrlParams = () => {
    setPage(urlPagination.page);
    setPageSize(urlPagination.pageSize);
    setOrderBy(undefined);
    setOrderSort(undefined);
    setQ(undefined);
  };

  const getRolesVariables = { page, pageSize, q, orderBy, orderSort };
  const getRolesQuery = useQuery<{ roles: RolesObject }, RolesArgs>(GET_ROLES, {
    variables: getRolesVariables,
  });

  useEffect(() => {
    if (_.isEmpty(urlParams)) {
      resetUrlParams();
    }
  }, [urlParams]);

  useEffect(() => {
    (async () => getRolesQuery.refetch())();
  }, [props.history.location.key]);

  const [deleteRoleMutate, deleteRoleMutation] = useMutation<Role>(DELETE_ROLE, {
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_ROLES, variables: getRolesVariables }],
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
      render: (text: string, record: Role) => <Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>,
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
      render: (text: string, record: Role) => (
        <TableColumnDeleteButton
          id={record.id}
          loading={deleteRoleMutation.loading}
          onClick={async () => deleteRoleMutate({ variables: { id: Number(record.id) } })}
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
      loading={getRolesQuery.loading}
    >
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
