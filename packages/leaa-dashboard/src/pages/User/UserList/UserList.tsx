import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Icon, Table, Button, Tag, message } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/src/constants';
import { GET_USERS, DELETE_USER } from '@leaa/common/src/graphqls';
import { User } from '@leaa/common/src/entrys';
import { IOrderSort } from '@leaa/common/src/dtos/_common';
import { UsersWithPaginationObject, UsersArgs } from '@leaa/common/src/dtos/user';
import { urlUtil, tableUtil } from '@leaa/dashboard/src/utils';
import { IPage } from '@leaa/dashboard/src/interfaces';

import {
  HtmlMeta,
  PageCard,
  ErrorCard,
  TableCard,
  SearchInput,
  SwitchNumber,
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
  const getUsersVariables = { page, pageSize, q, orderBy, orderSort };
  const getUsersQuery = useQuery<{ users: UsersWithPaginationObject }, UsersArgs>(GET_USERS, {
    variables: getUsersVariables,
  });

  // mutation
  const [getUsersMutate, getUsersMutation] = useMutation<User>(DELETE_USER, {
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_USERS, variables: getUsersVariables }],
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
      width: 50,
      render: (text: string) => <TableColumnId id={text} />,
    },
    {
      title: t('_lang:email'),
      width: 300,
      dataIndex: 'email',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'email'),
      render: (text: string, record: User) => <Link to={`${props.route.path}/${record.id}`}>{record.email}</Link>,
    },
    {
      title: t('_lang:name'),
      dataIndex: 'name',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'name'),
    },
    {
      title: t('_lang:role'),
      dataIndex: 'role',
      render: (text: string, record: User) => (
        <div>{record.roles && record.roles.map(r => <Tag key={r.name}>{r.name}</Tag>)}</div>
      ),
    },
    {
      title: t('_lang:status'),
      dataIndex: 'status',
      render: (text: string, record: User) => <SwitchNumber value={record.status} size="small" disabled />,
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
      render: (text: string, record: User) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.name}
          loading={getUsersMutation.loading}
          onClick={async () => getUsersMutate({ variables: { id: Number(record.id) } })}
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
      loading={getUsersQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getUsersQuery.error ? <ErrorCard error={getUsersQuery.error} /> : null}
      {getUsersMutation.error ? <ErrorCard error={getUsersMutation.error} /> : null}

      {getUsersQuery.data && getUsersQuery.data.users && getUsersQuery.data.users.items && (
        <TableCard
          selectedRowKeys={selectedRowKeys}
          selectedRowBar={
            <Button type="danger" size="small" icon="delete">
              {t('_lang:delete')}
            </Button>
          }
        >
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={getUsersQuery.data.users.items}
            pagination={{
              defaultCurrent: page,
              defaultPageSize: pageSize,
              total: getUsersQuery.data.users.total,
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
