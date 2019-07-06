import _ from 'lodash';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import queryString from 'query-string';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/constants';
import { GET_USERS } from '@leaa/common/graphqls';
import { User } from '@leaa/common/entrys';
import { IOrderSort } from '@leaa/common/dtos/_common';
import { UsersObject, UsersArgs } from '@leaa/common/dtos/user';
import { urlUtil } from '@leaa/dashboard/utils';
import { IPage } from '@leaa/dashboard/interfaces';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SearchInput } from '@leaa/dashboard/components/SearchInput';
import { TableCard } from '@leaa/dashboard/components/TableCard';

import style from './style.less';

export default (props: IPage) => {
  const urlParams = queryString.parse(window.location.search);
  const urlPagination = urlUtil.getPagination(urlParams);

  const [page, setPage] = useState<number | undefined>(urlPagination.page);
  const [pageSize, setPageSize] = useState<number | undefined>(urlPagination.pageSize);
  const [q, setQ] = useState<string | undefined>(urlParams && urlParams.q ? `${urlParams.q}` : undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>([]);
  const [orderSort, setOrderSort] = useState<IOrderSort | string | undefined>(
    urlParams && urlParams.orderSort ? urlUtil.formatOrderSort(`${urlParams.orderSort}`) : undefined,
  );
  const [orderBy, setOrderBy] = useState<string | undefined>(
    urlParams && urlParams.orderBy ? `${urlParams.orderBy}` : undefined,
  );

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

  const variables = { page, pageSize, q, orderBy, orderSort };
  const { loading, data, error } = useQuery<{ users: UsersObject }, UsersArgs>(GET_USERS, { variables });

  if (error) {
    return <ErrorCard message={error.message} />;
  }

  const calcDefaultSortOrder = (sort?: string, by?: string, field?: string): 'descend' | 'ascend' | boolean => {
    if (!by || !sort || !field) {
      return false;
    }

    if (by === field) {
      if (sort === 'DESC') {
        return 'descend';
      }
      if (sort === 'ASC') {
        return 'ascend';
      }
    }

    return false;
  };

  const rowSelection = {
    columnWidth: 30,
    onChange: (keys: number[] | string[]) => {
      setSelectedRowKeys(keys);
    },
    selectedRowKeys,
  };

  const columns = [
    {
      title: 'Email',
      width: 300,
      dataIndex: 'email',
      sorter: true,
      sortOrder: calcDefaultSortOrder(orderSort, orderBy, 'email'),
      render: (text: string, record: User) => <Link to={`${props.route.path}/${record.id}`}>{record.email}</Link>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      sortOrder: calcDefaultSortOrder(orderSort, orderBy, 'name'),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      sorter: true,
      sortOrder: calcDefaultSortOrder(orderSort, orderBy, 'created_at'),
      render: (text: string) => <small>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</small>,
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      width: 50,
      render: () => <Button size="small" icon="delete" />,
    },
  ];

  return (
    <PageCard
      title={props.route.name}
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
      className={style['page-wapper']}
      loading={loading}
    >
      {data && data.users && data.users.items && (
        <TableCard
          selectedRowKeys={selectedRowKeys}
          selectedRowBar={
            <Button type="danger" size="small" icon="delete">
              Delete
            </Button>
          }
        >
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data.users.items}
            pagination={{
              defaultCurrent: page,
              defaultPageSize: pageSize,
              pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
              showSizeChanger: true,
              //
              total: data.users.total,
              current: page,
              pageSize,
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
