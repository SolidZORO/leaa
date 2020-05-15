import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { Table } from 'antd';

import { Action } from '@leaa/common/src/entrys';
import { envConfig } from '@leaa/dashboard/src/configs';
import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON, DEFAULT_QUERY } from '@leaa/dashboard/src/constants';
import {
  IPage,
  IKey,
  ICurdGetDataWithPagination,
  ICurdError,
  ICrudQueryParams,
  ICurdDeleteData,
  ITableColumns,
} from '@leaa/dashboard/src/interfaces';
import {
  ajax,
  errorMsg,
  setCurdQueryToUrl,
  formatOrderSort,
  calcTableSortOrder,
  transUrlQueryToCurdState,
  msg,
  genFuzzySearchByQ,
} from '@leaa/dashboard/src/utils';
import {
  Rcon,
  PageCard,
  HtmlMeta,
  TableCard,
  SearchInput,
  FilterIcon,
  TableColumnId,
  TableColumnDeleteButton,
} from '@leaa/dashboard/src/components';

import style from './style.module.less';

const ROUTE_NAME = 'actions';

export default (props: IPage) => {
  const { t } = useTranslation();

  const [crudQuery, setCrudQuery] = useState<ICrudQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCurdState(window.location.search),
  });
  const [list, setList] = useState<ICurdGetDataWithPagination<Action>>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<IKey[]>([]);

  const [fetchLoading, setFetchLoading] = useState<any>(false);
  const [deleteLoading, setDeleteLoading] = useState<any>(false);

  const fetchList = (params: ICrudQueryParams) => {
    setCrudQuery(params);
    setFetchLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${ROUTE_NAME}`, { params: RequestQueryBuilder.create(params).queryObject })
      .then((res: AxiosResponse<ICurdGetDataWithPagination<Action>>) => {
        console.log(res.data);
        setList(res.data);

        setCurdQueryToUrl({ window, query: params, replace: true });
      })
      .catch((err: AxiosError<ICurdError>) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setFetchLoading(false));
  };

  const deleteItem = (id?: number) => {
    setDeleteLoading(true);

    ajax
      .delete(`${envConfig.API_URL}/${ROUTE_NAME}/${id}`)
      .then((res: AxiosResponse<ICurdDeleteData<Action>>) => {
        msg(t('_lang:deletedSuccessfully', { id: res?.data?.id }));
        fetchList(crudQuery);
      })
      .catch((err: AxiosError<ICurdError>) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setDeleteLoading(false));
  };

  useEffect(() => fetchList(crudQuery), [crudQuery]);
  useEffect(() => (props.history.location.key ? setCrudQuery(DEFAULT_QUERY) : undefined), [props.history.location.key]);

  const rowSelection = {
    columnWidth: 30,
    onChange: (keys: IKey[]) => setSelectedRowKeys(keys),
    selectedRowKeys,
  };

  const columns: ITableColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 75, // ID
      sorter: true,
      sortOrder: calcTableSortOrder('id', crudQuery.sort),
      render: (id: string) => <TableColumnId id={id} link={`${props.route.path}/${id}`} />,
    },
    {
      title: t('_lang:account'),
      dataIndex: 'account',
      sorter: true,
      sortOrder: calcTableSortOrder('account', crudQuery.sort),
      render: (text: string, record: Action) => record.account,
    },
    {
      title: t('_lang:module'),
      dataIndex: 'module',
      sorter: true,
      sortOrder: calcTableSortOrder('module', crudQuery.sort),
      render: (text: string, record: Action) => <>{record.module}</>,
    },
    {
      title: t('_lang:action'),
      dataIndex: 'action',
      sorter: true,
      sortOrder: calcTableSortOrder('action', crudQuery.sort),
      render: (text: string, record: Action) => <>{record.action}</>,
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Action) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.module}
          loading={deleteLoading}
          onClick={() => deleteItem(record.id)}
        />
      ),
    },
  ];

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
          <FilterIcon query={crudQuery} clearQuery={['q', 'search']} onClose={(query: any) => setCrudQuery(query)} />

          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={crudQuery.q}
            onSearch={(s?: string) => {
              return setCrudQuery({
                ...DEFAULT_QUERY,
                q: s,
                search: genFuzzySearchByQ(s, { type: '$or', fields: ['account', 'module'] }),
              });
            }}
          />
        </div>
      }
      className={style['wapper']}
      loading={fetchLoading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {list?.data && (
        <TableCard selectedRowKeys={selectedRowKeys} totalLength={list.total}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={list.data}
            pagination={{
              total: list.total,
              current: list.page,
              pageSize: crudQuery.limit,
              pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
              showSizeChanger: true,
            }}
            onChange={(pagination, filters, sorter: any) => {
              setCrudQuery({
                ...crudQuery,
                limit: pagination.pageSize,
                page: pagination.current,
                sort: formatOrderSort(sorter),
              });
            }}
          />
        </TableCard>
      )}
    </PageCard>
  );
};
