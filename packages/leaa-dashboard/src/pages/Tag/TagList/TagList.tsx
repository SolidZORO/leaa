import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
import { GET_TAGS, DELETE_TAG } from '@leaa/dashboard/src/graphqls';

import { Tag as TagEntry } from '@leaa/common/src/entrys';
import { TagsWithPaginationObject, TagsArgs } from '@leaa/common/src/dtos/tag';
import { IPage, IKey, ITablePagination } from '@leaa/dashboard/src/interfaces';
import { urlUtil, tableUtil, messageUtil, authUtil } from '@leaa/dashboard/src/utils';

import {
  Rcon,
  PageCard,
  HtmlMeta,
  TableCard,
  SearchInput,
  TableColumnId,
  TableColumnDate,
  TableColumnDeleteButton,
} from '@leaa/dashboard/src/components';

import { SyncTagsToFileButton } from '../_components/SyncTagsToFileButton/SyncTagsToFileButton';

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
  const getTagsVariables = { ...tablePagination, q };
  const getTagsQuery = useQuery<{ tags: TagsWithPaginationObject }, TagsArgs>(GET_TAGS, {
    variables: getTagsVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [deleteTagMutate, deleteTagMutation] = useMutation<TagEntry>(DELETE_TAG, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlSuccess(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_TAGS, variables: getTagsVariables }],
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
      title: t('_lang:name'),
      dataIndex: 'name',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'name'),
      render: (text: string, record: TagEntry) => <Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>,
    },
    {
      title: t('_lang:description'),
      dataIndex: 'description',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'description'),
      render: (text: string, record: TagEntry) => (
        <small>
          <code>{record.description}</code>
        </small>
      ),
    },
    {
      title: t('_lang:views'),
      dataIndex: 'views',
      sorter: true,
      width: 150,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'views'),
      render: (text: string, record: TagEntry) => (
        <small>
          <code>{record.views}</code>
        </small>
      ),
    },
    {
      title: t('_lang:createdAt'),
      dataIndex: 'created_at',
      sorter: true,
      width: 120,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'created_at'),
      render: (text: string) => <TableColumnDate date={text} size="small" />,
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: TagEntry) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.name}
          loading={deleteTagMutation.loading}
          onClick={async () => deleteTagMutate({ variables: { id: Number(record.id) } })}
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
          <Link className="g-page-card-create-link" to={`${props.route.path}/create`}>
            <Rcon type={PAGE_CARD_TITLE_CREATE_ICON} />
          </Link>
        </span>
      }
      extra={
        <div className="g-page-card-extra-filter-bar-wrapper">
          {authUtil.getAuthInfo().flatPermissions.includes('tag.item-update') && (
            <SyncTagsToFileButton className={style['sync-tags-to-file-button']} />
          )}

          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={q}
            onChange={v => onFilter({ field: 'q', value: v })}
          />
        </div>
      }
      className={style['wapper']}
      loading={getTagsQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getTagsQuery?.data?.tags?.items && (
        <TableCard selectedRowKeys={selectedRowKeys} totalLength={getTagsQuery.data.tags.total}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns as any}
            dataSource={getTagsQuery.data.tags.items}
            pagination={{
              defaultCurrent: tablePagination.page,
              defaultPageSize: tablePagination.pageSize,
              total: getTagsQuery.data.tags.total,
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
