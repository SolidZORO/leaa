import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, message } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/constants';
import { GET_ARTICLES, DELETE_ARTICLE } from '@leaa/common/graphqls';
import { Article } from '@leaa/common/entrys';
import { IOrderSort } from '@leaa/common/dtos/_common';
import { ArticlesObject, ArticleArgs } from '@leaa/common/dtos/article';
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

  const getArticlesVariables = { page, pageSize, q, orderBy, orderSort };
  const getArticlesQuery = useQuery<{ articles: ArticlesObject }, ArticleArgs>(GET_ARTICLES, {
    variables: getArticlesVariables,
  });

  useEffect(() => {
    if (_.isEmpty(urlParams)) {
      resetUrlParams();
    }
  }, [urlParams]);

  useEffect(() => {
    (async () => getArticlesQuery.refetch())();
  }, [props.history.location.key]);

  const [deleteArticleMutate, deleteArticleMutation] = useMutation<Article>(DELETE_ARTICLE, {
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_ARTICLES, variables: getArticlesVariables }],
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
      title: t('_lang:title'),
      dataIndex: 'title',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'title'),
      render: (text: string, record: Article) => <Link to={`${props.route.path}/${record.id}`}>{record.title}</Link>,
    },
    {
      title: t('_lang:slug'),
      dataIndex: 'slug',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'slug'),
    },
    {
      title: `${t('_lang:parent')} ID`,
      dataIndex: 'categoryId',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'categoryId'),
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
      render: (text: string, record: Article) => (
        <TableColumnDeleteButton
          id={record.id}
          loading={deleteArticleMutation.loading}
          onClick={async () => deleteArticleMutate({ variables: { id: Number(record.id) } })}
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
      loading={getArticlesQuery.loading}
    >
      {getArticlesQuery.error ? <ErrorCard error={getArticlesQuery.error} /> : null}
      {deleteArticleMutation.error ? <ErrorCard error={deleteArticleMutation.error} /> : null}

      {getArticlesQuery.data && getArticlesQuery.data.articles && getArticlesQuery.data.articles.items && (
        <TableCard selectedRowKeys={selectedRowKeys}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={getArticlesQuery.data.articles.items}
            pagination={{
              defaultCurrent: page,
              defaultPageSize: pageSize,
              total: getArticlesQuery.data.articles.total,
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
