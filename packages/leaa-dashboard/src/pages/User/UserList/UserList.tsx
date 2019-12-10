import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, Button, Tag } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
import { GET_USERS, DELETE_USER, UPDATE_USER } from '@leaa/common/src/graphqls';
import { User } from '@leaa/common/src/entrys';
import { IOrderSort } from '@leaa/common/src/dtos/_common';
import { UsersWithPaginationObject, UsersArgs } from '@leaa/common/src/dtos/user';
import { urlUtil, tableUtil, messageUtil } from '@leaa/dashboard/src/utils';
import { IPage, IKey } from '@leaa/dashboard/src/interfaces';

import {
  HtmlMeta,
  PageCard,
  TableCard,
  SearchInput,
  TableColumnDate,
  TableColumnDeleteButton,
  TableColumnId,
  TableColumnStatusSwitch,
  Rcon,
} from '@leaa/dashboard/src/components';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = urlUtil.getPagination(urlParams);

  const [q, setQ] = useState<string | undefined>(urlParams.q ? `${urlParams.q}` : undefined);
  const [page, setPage] = useState<number | undefined>(urlPagination.page);
  const [pageSize, setPageSize] = useState<number | undefined>(urlPagination.pageSize);
  const [selectedRowKeys, setSelectedRowKeys] = useState<IKey[]>([]);

  // sort
  const [orderBy, setOrderBy] = useState<string | undefined>(urlParams.orderBy ? `${urlParams.orderBy}` : undefined);
  const [orderSort, setOrderSort] = useState<IOrderSort | undefined>(
    urlParams.orderSort ? urlUtil.formatOrderSort(`${urlParams.orderSort}`) : undefined,
  );

  // query
  const getUsersVariables = { page, pageSize, q, orderBy, orderSort };
  const getUsersQuery = useQuery<{ users: UsersWithPaginationObject }, UsersArgs>(GET_USERS, {
    variables: getUsersVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [getUsersMutate, getUsersMutation] = useMutation<User>(DELETE_USER, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlCompleted(t('_lang:deletedSuccessfully')),
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
    onChange: (keys: IKey[]) => setSelectedRowKeys(keys),
    selectedRowKeys,
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'id'),
      render: (id: string) => <TableColumnId id={id} link={`${props.route.path}/${id}`} />,
    },
    {
      title: <Rcon type="ri-vip-crown-2-line" />,
      width: 30,
      dataIndex: 'is_admin',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'is_admin'),
      render: (text: string, record: User) => (record.is_admin ? <Rcon type="ri-vip-crown-2-line" /> : null),
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
      title: t('_lang:created_at'),
      dataIndex: 'created_at',
      width: 120,
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'created_at'),
      render: (text: string) => <TableColumnDate date={text} size="small" />,
    },
    {
      title: t('_lang:status'),
      dataIndex: 'status',
      width: 60,
      render: (text: string, record: User) => (
        <TableColumnStatusSwitch
          id={Number(record.id)}
          value={Number(record.status)}
          size="small"
          variablesField="user"
          mutation={UPDATE_USER}
          refetchQueries={[{ query: GET_USERS, variables: getUsersVariables }]}
        />
      ),
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
          <Rcon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
          <Link className="page-card-create-link" to={`${props.route.path}/create`}>
            <Rcon type={PAGE_CARD_TITLE_CREATE_ICON} />
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
