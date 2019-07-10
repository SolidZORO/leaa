import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, message } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/constants';
import { GET_CATEGORIES, DELETE_CATEGORY } from '@leaa/common/graphqls';
import { Category } from '@leaa/common/entrys';
import { IOrderSort } from '@leaa/common/dtos/_common';
import { CategoriesObject, CategoryArgs } from '@leaa/common/dtos/category';
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

  const getCategoriesVariables = { page, pageSize, q, orderBy, orderSort };
  const getCategoriesQuery = useQuery<{ categories: CategoriesObject }, CategoryArgs>(GET_CATEGORIES, {
    variables: getCategoriesVariables,
  });

  useEffect(() => {
    if (_.isEmpty(urlParams)) {
      resetUrlParams();
    }
  }, [urlParams]);

  useEffect(() => {
    (async () => getCategoriesQuery.refetch())();
  }, [props.history.location.key]);

  const [deleteCategoryMutate, deleteCategoryMutation] = useMutation<Category>(DELETE_CATEGORY, {
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_CATEGORIES, variables: getCategoriesVariables }],
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
      render: (text: string, record: Category) => <Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>,
    },
    {
      title: t('_lang:slug'),
      dataIndex: 'slug',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'slug'),
    },
    {
      title: `${t('_lang:parent')} ID`,
      dataIndex: 'parentId',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'parentId'),
      render: (text: string) => <TableColumnId id={text} />,
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
      render: (text: string, record: Category) => (
        <TableColumnDeleteButton
          id={record.id}
          loading={deleteCategoryMutation.loading}
          onClick={async () => deleteCategoryMutate({ variables: { id: Number(record.id) } })}
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
      loading={getCategoriesQuery.loading}
    >
      {getCategoriesQuery.error ? <ErrorCard error={getCategoriesQuery.error} /> : null}
      {deleteCategoryMutation.error ? <ErrorCard error={deleteCategoryMutation.error} /> : null}

      {getCategoriesQuery.data && getCategoriesQuery.data.categories && getCategoriesQuery.data.categories.items && (
        <TableCard selectedRowKeys={selectedRowKeys}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={getCategoriesQuery.data.categories.items}
            pagination={{
              defaultCurrent: page,
              defaultPageSize: pageSize,
              total: getCategoriesQuery.data.categories.total,
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
