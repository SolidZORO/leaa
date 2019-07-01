import React, { useState } from 'react';
import { Table } from 'antd';
import { useQuery } from '@apollo/react-hooks';

import { GET_USERS } from '@leaa/common/graphqls';
import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/constants';
import { UsersObject, UsersArgs } from '@leaa/common/dtos/user';
import { urlUtil } from '@leaa/dashboard/utils';
import { IPage } from '@leaa/dashboard/interfaces';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SearchInput } from '@leaa/dashboard/components/SearchInput';

import style from './style.less';

export default (props: IPage) => {
  const urlPagination = urlUtil.getPagination(window);

  const [page, setPage] = useState<number | undefined>(urlPagination.page);
  const [pageSize, setPageSize] = useState<number | undefined>(urlPagination.pageSize);

  const variables = { page, pageSize };
  console.log('VARIABLES --->', variables);

  const { loading, data, error } = useQuery<{ users: UsersObject }, UsersArgs>(GET_USERS, {
    variables,
  });

  // if (error) {
  //   return <ErrorCard message={error.message} />;
  // }

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
      render: () => <div>Action</div>,
    },
  ];

  return (
    <PageCard
      title={props.route.name}
      extra={
        <SearchInput
          onChange={(e: string) => {
            urlUtil.mergeParamToUrlQuery({
              window,
              params: {
                q: e,
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
        <Table
          rowKey="id"
          size="small"
          loading={loading}
          columns={columns}
          dataSource={data.users.items}
          pagination={{
            total: data.users.total,
            showSizeChanger: true,
            defaultCurrent: page,
            defaultPageSize: pageSize,
            pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
          }}
          onChange={pagination => {
            setPage(pagination.current);
            setPageSize(pagination.pageSize);

            urlUtil.mergeParamToUrlQuery({
              window,
              params: urlUtil.pickPagination(pagination),
              replace: true,
            });
          }}
        />
      )}
    </PageCard>
  );
};
