import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
import { GET_AXS, DELETE_AX, UPDATE_AX } from '@leaa/common/src/graphqls';

import { Ax } from '@leaa/common/src/entrys';
import { AxsWithPaginationObject, AxsArgs } from '@leaa/common/src/dtos/ax';
import { IPage, IKey, ITablePagination } from '@leaa/dashboard/src/interfaces';
import { urlUtil, tableUtil, messageUtil } from '@leaa/dashboard/src/utils';

import {
  Rcon,
  PageCard,
  HtmlMeta,
  TableCard,
  SearchInput,
  TableColumnId,
  TableColumnDate,
  TableColumnDeleteButton,
  TableColumnStatusSwitch,
} from '@leaa/dashboard/src/components';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = urlUtil.getPagination(urlParams);

  const [tablePagination, setTablePagination] = useState<ITablePagination>(urlUtil.initPaginationState(urlParams));

  const [q, setQ] = useState<string | undefined>(urlParams.q ? String(urlParams.q) : undefined);

  // query
  const getAxsVariables = { ...tablePagination, q };
  const getAxsQuery = useQuery<{ axs: AxsWithPaginationObject }, AxsArgs>(GET_AXS, {
    variables: getAxsVariables,
  });

  // mutation
  const [deleteAxMutate, deleteAxMutation] = useMutation<Ax>(DELETE_AX, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlSuccess(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_AXS, variables: getAxsVariables }],
  });

  const resetUrlParams = () => {
    setTablePagination({
      page: urlPagination.page,
      pageSize: urlPagination.pageSize,
      selectedRowKeys: [],
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
    onChange: (keys: IKey[]) => setTablePagination({ ...tablePagination, selectedRowKeys: keys }),
    selectedRowKeys: tablePagination.selectedRowKeys,
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
      title: t('_lang:title'),
      dataIndex: 'title',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'title'),
      render: (text: string, record: Ax) => <Link to={`${props.route.path}/${record.id}`}>{record.title}</Link>,
    },
    {
      title: t('_lang:slug'),
      dataIndex: 'slug',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'slug'),
    },
    {
      title: t('_lang:createdAt'),
      dataIndex: 'created_at',
      width: 120,
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'created_at'),
      render: (text: string) => <TableColumnDate date={text} size="small" />,
    },
    {
      title: t('_lang:status'),
      dataIndex: 'status',
      width: 60,
      render: (text: string, record: Ax) => (
        <TableColumnStatusSwitch
          id={Number(record.id)}
          value={Number(record.status)}
          size="small"
          variablesField="ax"
          mutation={UPDATE_AX}
          refetchQueries={[{ query: GET_AXS, variables: getAxsVariables }]}
        />
      ),
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Ax) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.title}
          loading={deleteAxMutation.loading}
          onClick={async () => deleteAxMutate({ variables: { id: Number(record.id) } })}
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
          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={q}
            onChange={v => onFilter({ field: 'q', value: v })}
          />
        </div>
      }
      className={style['wapper']}
      loading={getAxsQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getAxsQuery?.data?.axs?.items && (
        <TableCard selectedRowKeys={tablePagination.selectedRowKeys}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns as any}
            dataSource={getAxsQuery.data.axs.items}
            pagination={{
              defaultCurrent: tablePagination.page,
              defaultPageSize: tablePagination.pageSize,
              total: getAxsQuery.data.axs.total,
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
                selectedRowKeys: [],
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
