import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table } from 'antd';

import { Auth } from '@leaa/common/src/entrys';
import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
import { GET_AUTHS, DELETE_AUTH } from '@leaa/dashboard/src/graphqls';
import { AuthsWithPaginationObject, AuthsArgs } from '@leaa/common/src/dtos/auth';
import { IPage, IKey, ITablePagination } from '@leaa/dashboard/src/interfaces';
import { urlUtil, tableUtil, msgUtil } from '@leaa/dashboard/src/utils';

import {
  Rcon,
  PageCard,
  HtmlMeta,
  TableCard,
  SearchInput,
  TableColumnId,
  UserAvatar,
  TableColumnDate,
  TableColumnDeleteButton,
  IdTag,
} from '@leaa/dashboard/src/components';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = urlUtil.getPagination(urlParams);

  const [tablePagination, setTablePagination] = useState<ITablePagination>(urlUtil.initPaginationState(urlParams));
  const [selectedRowKeys, setSelectedRowKeys] = useState<IKey[]>([]);

  // filter
  const [q, setQ] = useState<string | undefined>(urlParams.q ? String(urlParams.q) : undefined);

  // query
  const getAuthesVariables = { ...tablePagination, q };
  const getAuthesQuery = useQuery<{ auths: AuthsWithPaginationObject }, AuthsArgs>(GET_AUTHS, {
    variables: getAuthesVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [deleteAuthMutate, deleteAuthMutation] = useMutation<Auth>(DELETE_AUTH, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msgUtil.message(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_AUTHS, variables: getAuthesVariables }],
  });

  const resetUrlParams = () => {
    setTablePagination({
      page: urlPagination.page,
      pageSize: urlPagination.pageSize,
      orderBy: undefined,
      orderSort: undefined,
    });

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
      width: 60,
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'id'),
      render: (id: string) => <TableColumnId id={id} link={`${props.route.path}/${id}`} />,
    },
    {
      title: t('_lang:avatar'),
      dataIndex: 'avatar_url',
      width: 80,
      render: (avatar: string) => <UserAvatar url={avatar} />,
    },
    {
      title: t('_page:Auth.nickname'),
      dataIndex: 'nickname',
      width: 100,
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'nickname'),
    },
    {
      title: t('_page:Auth.platform'),
      width: 100,
      dataIndex: 'platform',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'platform'),
    },
    {
      title: t('_page:Auth.openId'),
      dataIndex: 'open_id',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'open_id'),
      render: (openId: string) => <span>{openId}</span>,
    },
    {
      title: t('_page:Auth.userId'),
      dataIndex: 'user_id',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'user_id'),
      render: (userId: string) => <IdTag id={userId} link={`/users/${userId}`} icon={<Rcon type="ri-user-3-line" />} />,
    },
    {
      title: t('_page:Auth.lastAuthAt'),
      dataIndex: 'last_auth_at',
      width: 120,
      render: (text: string) => <TableColumnDate date={text} size="small" />,
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Auth) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={`${record.nickname}`}
          loading={deleteAuthMutation.loading}
          onClick={async () => deleteAuthMutate({ variables: { id: Number(record.id) } })}
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

    urlUtil.mergeParamToUrlQuery({
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
            onChange={v => onFilter({ field: 'q', value: v })}
          />
        </div>
      }
      className={style['wapper']}
      loading={getAuthesQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getAuthesQuery?.data?.auths?.items && (
        <TableCard selectedRowKeys={selectedRowKeys} totalLength={getAuthesQuery.data.auths.total}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns as any}
            dataSource={getAuthesQuery.data.auths.items}
            pagination={{
              defaultCurrent: tablePagination.page,
              defaultPageSize: tablePagination.pageSize,
              total: getAuthesQuery.data.auths.total,
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
                orderBy: urlUtil.formatOrderBy(sorter.field),
                orderSort: urlUtil.formatOrderSort(sorter.order),
              });

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
