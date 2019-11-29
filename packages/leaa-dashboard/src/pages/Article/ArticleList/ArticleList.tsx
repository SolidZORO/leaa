import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, Icon, message, Tag } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/src/constants';
import { GET_ARTICLES, DELETE_ARTICLE, UPDATE_ARTICLE, GET_USERS } from '@leaa/common/src/graphqls';
import { Article, Tag as TagEntry } from '@leaa/common/src/entrys';
import { IOrderSort } from '@leaa/common/src/dtos/_common';
import { ArticlesWithPaginationObject, ArticleArgs } from '@leaa/common/src/dtos/article';
import { urlUtil, tableUtil } from '@leaa/dashboard/src/utils';
import { IPage } from '@leaa/dashboard/src/interfaces';

import {
  PageCard,
  HtmlMeta,
  ErrorCard,
  SearchInput,
  TableCard,
  TableColumnId,
  TableColumnDate,
  TableColumnDeleteButton,
  SelectCategoryIdByTree,
  TagSearchBox,
  TableColumnStatusSwitch,
} from '@leaa/dashboard/src/components';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = urlUtil.getPagination(urlParams);

  const [q, setQ] = useState<string | undefined>(urlParams.q ? `${urlParams.q}` : undefined);
  const [page, setPage] = useState<number | undefined>(urlPagination.page);
  const [pageSize, setPageSize] = useState<number | undefined>(urlPagination.pageSize);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>([]);
  const [tagName, setTagName] = useState<string | undefined>(
    urlParams && urlParams.tagName ? `${urlParams.tagName}` : undefined,
  );
  const [categoryId, setCategoryId] = useState<number | undefined>(
    urlParams && urlParams.categoryId ? Number(urlParams.categoryId) : undefined,
  );

  // sort
  const [orderBy, setOrderBy] = useState<string | undefined>(urlParams.orderBy ? `${urlParams.orderBy}` : undefined);
  const [orderSort, setOrderSort] = useState<IOrderSort | undefined>(
    urlParams.orderSort ? urlUtil.formatOrderSort(`${urlParams.orderSort}`) : undefined,
  );

  // query
  const getArticlesVariables = { page, pageSize, q, orderBy, orderSort, tagName, categoryId };
  const getArticlesQuery = useQuery<{ articles: ArticlesWithPaginationObject }, ArticleArgs>(GET_ARTICLES, {
    variables: getArticlesVariables,
  });

  // mutation
  const [deleteArticleMutate, deleteArticleMutation] = useMutation<Article>(DELETE_ARTICLE, {
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_ARTICLES, variables: getArticlesVariables }],
  });

  const resetUrlParams = () => {
    setPage(urlPagination.page);
    setPageSize(urlPagination.pageSize);
    setOrderBy(undefined);
    setOrderSort(undefined);
    setQ(undefined);
    setTagName(undefined);
    setCategoryId(undefined);
  };

  useEffect(() => {
    if (_.isEmpty(urlParams)) {
      resetUrlParams();
    }
  }, [urlParams]);

  useEffect(() => {
    (async () => getArticlesQuery.refetch())();
  }, [props.history.location.key]);

  const rowSelection = {
    columnWidth: 30,
    onChange: (keys: number[] | string[]) => setSelectedRowKeys(keys),
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
      title: t('_lang:title'),
      dataIndex: 'title',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'title'),
      render: (text: string, record: Article) => (
        <>
          <Link to={`${props.route.path}/${record.id}`}>{record.title}</Link>
          <small className={style['col-slug']}>{record.slug}</small>

          {record.tags && record.tags.length > 0 && (
            <small className={style['col-tags-wrapper']}>
              {record.tags.map(tag => (
                <Tag key={tag.name} className={style['col-tags-item']}>
                  {tag.name}
                </Tag>
              ))}
            </small>
          )}
        </>
      ),
    },
    {
      title: t('_lang:category'),
      dataIndex: 'category',
      width: 100,
      render: (text: string, record: Article) => (
        <span>{record.categories && record.categories.length > 0 ? record.categories[0].name : '----'}</span>
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
      render: (text: string, record: Article) => (
        <TableColumnStatusSwitch
          id={Number(record.id)}
          value={Number(record.status)}
          size="small"
          variablesField="article"
          mutation={UPDATE_ARTICLE}
          refetchQueries={[{ query: GET_ARTICLES, variables: getArticlesVariables }]}
        />
      ),
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Article) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.title}
          loading={deleteArticleMutation.loading}
          onClick={async () => deleteArticleMutate({ variables: { id: Number(record.id) } })}
        />
      ),
    },
  ];

  const onFilter = (params: { field: string; value: any }) => {
    setPage(1);

    const filterParams: { q?: string; categoryId?: number; tagName?: string } = {};

    if (params.field === 'q') {
      setQ(params.value);
      filterParams.q = params.value;
    }

    if (params.field === 'categoryId') {
      const v = Number.isNaN(params.value) ? undefined : params.value;

      setCategoryId(v);
      filterParams.categoryId = v;
    }

    if (params.field === 'tagName') {
      setTagName(params.value);
      filterParams.tagName = params.value;
    }

    urlUtil.mergeParamToUrlQuery({
      window,
      params: {
        page: 1,
        ...filterParams,
      },
      replace: true,
    });
  };

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
        <div className={style['filter-bar-wrapper']}>
          <Icon type="filter" className={style['filter-bar-icon']} />

          <TagSearchBox
            className={style['filter-bar-tag']}
            useOnBlur
            onSelectTagCallback={(v: TagEntry) => onFilter({ field: 'tagName', value: v.name })}
            onEnterCallback={(v: string | undefined) => onFilter({ field: 'tagName', value: v })}
            value={tagName}
            placeholder={t('_lang:tag')}
          />

          <SelectCategoryIdByTree
            className={style['filter-bar-category']}
            componentProps={{ allowClear: true }}
            onChange={(v: number | number[]) => onFilter({ field: 'categoryId', value: Number(v) })}
            value={categoryId || undefined}
          />

          <SearchInput
            className={style['filter-bar-search']}
            value={q}
            onChange={(v: string) => onFilter({ field: 'q', value: v })}
          />
        </div>
      }
      className={style['wapper']}
      loading={getArticlesQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

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
