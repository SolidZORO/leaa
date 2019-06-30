import React, { useState } from 'react';
import { Table } from 'antd';
import { useQuery } from '@apollo/react-hooks';

import { IPage } from '@leaa/dashboard/interfaces';
import { GET_USERS } from '@leaa/common/graphqls';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { UsersObject, UsersArgs } from '@leaa/common/dtos/user';

import style from './style.less';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 15;

export default (props: IPage) => {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const { loading, data, error } = useQuery<{ users: UsersObject }, UsersArgs>(GET_USERS, {
    variables: {
      page,
      pageSize,
    },
  });

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  const columns = [
    {
      title: 'Email',
      width: 100,
      dataIndex: 'email',
    },
    {
      title: 'Name',
      width: 100,
      dataIndex: 'name',
    },
    {
      title: 'Action',
      key: 'operation',
      width: 100,
      render: () => <a href="javascript:;">action</a>,
    },
  ];

  console.log(props);

  return (
    <PageCard title={props.route.name} className={style['page-wapper']} loading={loading}>
      {data && data.users && data.users.items && (
        <Table
          columns={columns}
          dataSource={data.users.items}
          size="small"
          pagination={{
            total: data.users.total,
            showSizeChanger: true,
            defaultPageSize: DEFAULT_PAGE_SIZE,
            defaultCurrent: DEFAULT_PAGE,
            pageSizeOptions: [5, 10, 15, 20, 30, 40, 50, 100, 500, 1000],
          }}
          onChange={(pagination, filters, sorter) => {
            console.log('params', pagination, filters, sorter);

            if (pagination.current) {
              setPage(pagination.current);
            }

            if (pagination.pageSize) {
              setPageSize(pagination.pageSize);
            }
          }}
        />
      )}
    </PageCard>
  );
};
