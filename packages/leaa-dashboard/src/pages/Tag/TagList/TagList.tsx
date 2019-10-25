import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, Icon, Button, message } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/src/constants';
import { GET_TAGS, DELETE_TAG } from '@leaa/common/src/graphqls';
import { Tag } from '@leaa/common/src/entrys';
import { IOrderSort } from '@leaa/common/src/dtos/_common';
import { TagsWithPaginationObject, TagArgs } from '@leaa/common/src/dtos/tag';
import { urlUtil, tableUtil, authUtil } from '@leaa/dashboard/src/utils';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { PageCard } from '@leaa/dashboard/src/components/PageCard';
import { HtmlMeta } from '@leaa/dashboard/src/components/HtmlMeta';
import { ErrorCard } from '@leaa/dashboard/src/components/ErrorCard';
import { SearchInput } from '@leaa/dashboard/src/components/SearchInput';
import { TableCard } from '@leaa/dashboard/src/components/TableCard';
import { TableColumnId } from '@leaa/dashboard/src/components/TableColumnId';
import { TableColumnDate } from '@leaa/dashboard/src/components/TableColumnDate';
import { TableColumnDeleteButton } from '@leaa/dashboard/src/components/TableColumnDeleteButton';

import { SyncTagsToFileButton } from '../_components/SyncTagsToFileButton/SyncTagsToFileButton';

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
  const getTagsVariables = { page, pageSize, q, orderBy, orderSort };
  const getTagsQuery = useQuery<{ tags: TagsWithPaginationObject }, TagArgs>(GET_TAGS, {
    variables: getTagsVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [deleteTagMutate, deleteTagMutation] = useMutation<Tag>(DELETE_TAG, {
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_TAGS, variables: getTagsVariables }],
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
      width: 80,
      render: (text: string) => <TableColumnId id={text} />,
    },
    {
      title: t('_lang:name'),
      dataIndex: 'name',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'name'),
      render: (text: string, record: Tag) => <Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>,
    },
    {
      title: t('_page:Tag.Component.count'),
      dataIndex: 'count',
      sorter: true,
      width: 150,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'count'),
      render: (text: string, record: Tag) => (
        <small>
          <code>{record.count}</code>
        </small>
      ),
    },
    {
      title: t('_lang:created_at'),
      dataIndex: 'created_at',
      sorter: true,
      width: 120,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'created_at'),
      render: (text: string) => <TableColumnDate date={text} size="small" />,
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Tag) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.name}
          loading={deleteTagMutation.loading}
          onClick={async () => deleteTagMutate({ variables: { id: Number(record.id) } })}
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
        <div className={style['extra-wrapper']}>
          {authUtil.getAuthInfo().flatePermissions.includes('tag.update') && (
            <SyncTagsToFileButton className={style['sync-tags-to-file-button']} />
          )}

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
        </div>
      }
      className={style['wapper']}
      loading={getTagsQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getTagsQuery.error ? <ErrorCard error={getTagsQuery.error} /> : null}
      {deleteTagMutation.error ? <ErrorCard error={deleteTagMutation.error} /> : null}

      {getTagsQuery.data && getTagsQuery.data.tags && getTagsQuery.data.tags.items && (
        <TableCard selectedRowKeys={selectedRowKeys}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={getTagsQuery.data.tags.items}
            pagination={{
              defaultCurrent: page,
              defaultPageSize: pageSize,
              total: getTagsQuery.data.tags.total,
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
