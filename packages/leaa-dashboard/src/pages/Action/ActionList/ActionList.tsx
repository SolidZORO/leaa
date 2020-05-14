import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON, DEFAULT_QUERY } from '@leaa/dashboard/src/constants';
import { Action } from '@leaa/common/src/entrys';
import {
  IPage,
  IKey,
  IApiCurdGetDataWithPagination,
  IApiCurdError,
  ICrudQueryParams,
  IApiCurdDeleteData,
} from '@leaa/dashboard/src/interfaces';
import {
  ajax,
  errorMsg,
  setCurdQueryToUrl,
  formatOrderSort,
  calcTableSortOrder,
  urlQueryToCurdState,
  msg,
} from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';

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

  const [crudQ, setCrudQ] = useState<ICrudQueryParams>({
    ...DEFAULT_QUERY,
    ...urlQueryToCurdState(window.location.search),
  });
  const [list, setList] = useState<any>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<IKey[]>([]);

  const [fetchLoading, setFetchLoading] = useState<any>(false);
  const [deleteLoading, setDeleteLoading] = useState<any>(false);

  const fetchList = (params: ICrudQueryParams) => {
    setFetchLoading(true);
    setCrudQ(params);

    ajax
      .get(`${envConfig.API_URL}/${ROUTE_NAME}`, { params: RequestQueryBuilder.create(params).queryObject })
      .then((res: AxiosResponse<IApiCurdGetDataWithPagination<Action>>) => {
        setList(res.data);

        setCurdQueryToUrl({ window, query: params, replace: true });
      })
      .catch((err: AxiosError<IApiCurdError>) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setFetchLoading(false));
  };

  const deleteItem = (id?: number) => {
    setDeleteLoading(true);

    ajax
      .delete(`${envConfig.API_URL}/${ROUTE_NAME}/${id}`)
      .then((res: AxiosResponse<IApiCurdDeleteData<Action>>) => {
        msg(t('_lang:deletedSuccessfully', { id: res?.data?.id }));
        fetchList(crudQ);
      })
      .catch((err: AxiosError<IApiCurdError>) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setDeleteLoading(false));
  };

  useEffect(() => fetchList(crudQ), [crudQ, props.history.location.search]);
  useEffect(() => (props.history.location.key ? setCrudQ(DEFAULT_QUERY) : undefined), [props.history.location.key]);

  const rowSelection = {
    columnWidth: 30,
    onChange: (keys: IKey[]) => setSelectedRowKeys(keys),
    selectedRowKeys,
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 75, // ID
      sorter: true,
      sortOrder: calcTableSortOrder('id', crudQ.sort),
      render: (id: string) => <TableColumnId id={id} link={`${props.route.path}/${id}`} />,
    },
    {
      title: t('_lang:account'),
      dataIndex: 'account',
      sorter: true,
      sortOrder: calcTableSortOrder('account', crudQ.sort),
      render: (text: string, record: Action) => <>{record.account}</>,
    },
    {
      title: t('_lang:module'),
      dataIndex: 'module',
      sorter: true,
      sortOrder: calcTableSortOrder('module', crudQ.sort),
      render: (text: string, record: Action) => <>{record.module}</>,
    },
    {
      title: t('_lang:action'),
      dataIndex: 'action',
      sorter: true,
      sortOrder: calcTableSortOrder('action', crudQ.sort),
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
          <FilterIcon
            query={crudQ}
            clearQuery={['q', 'search']}
            onClose={(clearQuery: any) => setCrudQ({ ...crudQ, ...clearQuery })}
          />

          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={crudQ?.q}
            onSearch={(s?: string) => {
              setCrudQ({
                ...crudQ,
                page: 1,
                q: s,
                search: s ? { $or: [{ module: { $cont: s } }, { account: { $cont: s } }] } : undefined,
              });
            }}
          />
        </div>
      }
      className={style['wapper']}
      loading={fetchLoading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {!!list?.data && (
        <TableCard selectedRowKeys={selectedRowKeys} totalLength={list.total}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns as any}
            dataSource={list?.data}
            pagination={{
              total: list.total,
              current: list.page,
              pageSize: crudQ?.limit,
              pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
              showSizeChanger: true,
            }}
            onChange={async (pagination, filters, sorter: any) => {
              await setCrudQ({
                ...crudQ,
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
