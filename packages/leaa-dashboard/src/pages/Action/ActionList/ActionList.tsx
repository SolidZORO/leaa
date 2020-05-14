import { AxiosError, AxiosResponse } from 'axios';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
// import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table } from 'antd';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
import { CreateQueryParams } from '@nestjsx/crud-request/lib/interfaces';
import { Action } from '@leaa/common/src/entrys';
import {
  IPage,
  IKey,
  IApiCurdGetDataWithPagination,
  IApiCurdError,
  ICrudQueryParams,
} from '@leaa/dashboard/src/interfaces';
import {
  ajax,
  errorMsg,
  setCurdQueryToUrl,
  formatOrderSortByPagination,
  calcTableSortOrder,
  urlToCurdState,
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
// import { GET_ARTICLES, DELETE_ARTICLE, UPDATE_ARTICLE } from '@leaa/dashboard/src/graphqls';

// window.qs = qs;
// window.queryString = queryString;

const ROUTE_NAME = 'actions';

export default (props: IPage) => {
  const { t } = useTranslation();

  const ACTIONS_QUERY_BY_URL: any = urlToCurdState(window.location.search);
  const ACTIONS_QUERY_BY_DEFAULT: CreateQueryParams = {
    // fields: ['account', 'id', 'module'],
    // search: { module: { $eq: 'auth' } },
    // join: [{ field: 'company' }],
    // sort: ['id', 'DESC'],
    // sort: ['account', 'ASC'],
    // search: undefined,
    page: 1,
    limit: 10,
  };

  const [actionsQuery, setActionsQuery] = useState<ICrudQueryParams>({
    ...ACTIONS_QUERY_BY_DEFAULT,
    ...ACTIONS_QUERY_BY_URL,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<IKey[]>([]);

  // query
  const [actions, setActions] = useState<any>([]);
  const [fetchActionsLoading, setFetchActionsLoading] = useState<any>(false);
  const [deleteActionLoading, setDeleteActionLoading] = useState<any>(false);

  const fetchActions = (params?: ICrudQueryParams) => {
    setFetchActionsLoading(true);
    setActionsQuery(params || ACTIONS_QUERY_BY_DEFAULT);
    ajax
      .get(`${envConfig.API_URL}/${ROUTE_NAME}`, { params: RequestQueryBuilder.create(params).queryObject })
      .then((res: AxiosResponse<IApiCurdGetDataWithPagination<Action>>) => {
        setActions(res.data);

        setCurdQueryToUrl({ window, query: params, replace: true });
      })
      .catch((err: AxiosError<IApiCurdError>) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setFetchActionsLoading(false));
  };

  // const deleteAction = (id?: number) => {
  //   setDeleteActionLoading(true);
  //
  //   ajax
  //     .delete(`${envConfig.API_URL}/${ROUTE_NAME}/${id}`)
  //     .then((res: AxiosResponse<IApiCurdDeleteData<Action>>) => {
  //       // setActions(res.data);
  //
  //       msg(t('_lang:deletedSuccessfully', { id: res?.data?.id }));
  //       console.log('DELETE', res);
  //       fetchActions(actionsQuery);
  //       // errorMsg();
  //
  //       // setCurdQueryToUrl({ window, query: params, replace: true });
  //     })
  //     .catch((err: AxiosError<IApiCurdError>) => errorMsg(err.response?.data?.message || err.message))
  //     .finally(() => setDeleteActionLoading(false));
  // };

  // useEffect(() => {
  //   // click sidebar menu
  //   // if (_.isEmpty(ACTIONS_QUERY_BY_DEFAULT)) fetchActions(ACTIONS_QUERY_BY_DEFAULT);
  //   window.history.pushState(null, '', `${window.location.origin}${window.location.pathname}`);
  //
  //   console.log('------------------');
  //   console.log('------------------');
  // }, [props.history.location.key]);

  useEffect(() => {
    fetchActions(actionsQuery);
  }, []);

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
      sortOrder: calcTableSortOrder('id', actionsQuery.sort),
      render: (id: string) => <TableColumnId id={id} link={`${props.route.path}/${id}`} />,
    },
    {
      title: t('_lang:account'),
      dataIndex: 'account',
      sorter: true,
      sortOrder: calcTableSortOrder('account', actionsQuery.sort),
      render: (text: string, record: Action) => <>{record.account}</>,
    },
    {
      title: t('_lang:module'),
      dataIndex: 'module',
      sorter: null,
      // sortOrder: calcTableSortOrder('module', actionsQuery.sort),
      // sortOrder: calcTableSortOrder('module', actionsQuery.sort),
      // sortOrder: false,
      render: (text: string, record: Action) => <>{record.module}</>,
    },
    // {
    //   title: t('_lang:action'),
    //   dataIndex: 'action',
    //   sorter: true,
    //   // sortOrder: calcTableSortOrder('action', actionsQuery.sort),
    //   render: (text: string, record: Action) => <>{record.action}</>,
    // },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Action) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.module}
          loading={deleteActionLoading}
          onClick={async () => deleteAction(record.id)}
          // onClick={async () => deleteAction(1111111)}
        />
      ),
    },
  ];

  // const onFilter = (params: { field: string; value?: string | string[] | null }) => {
  //   setTablePagination({ ...tablePagination, page: 1 });
  //
  //   const filterParams: { q?: string; categoryId?: string; brandId?: string; tagName?: string } = {};
  //
  //   if (params.field === 'q') {
  //     const result = params.value ? String(params.value) : undefined;
  //
  //     setQ(result);
  //     filterParams.q = result;
  //   }
  //
  //   if (params.field === 'tagName') {
  //     const result = params.value ? String(params.value) : undefined;
  //
  //     setTagName(result);
  //     filterParams.tagName = result;
  //   }
  //
  //   if (params.field === 'categoryId') {
  //     const result = params.value ? String(params.value) : undefined;
  //
  //     setCategoryId(result);
  //     filterParams.categoryId = result;
  //   }
  //
  //   mergeParamToUrlQuery({
  //     window,
  //     params: { page: 1, ...filterParams },
  //     replace: true,
  //   });
  // };

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
          <FilterIcon urlParams={actionsQuery} onClose={() => props.history.push(`/${ROUTE_NAME}`)} />

          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={actionsQuery?.q}
            // onChange={(v) => onFilter({ field: 'q', value: v })}
            onChange={(v) => {
              fetchActions({
                ...actionsQuery,
                ...ACTIONS_QUERY_BY_DEFAULT,
                q: v,
                search: {
                  $or: [{ module: { $cont: v } }, { account: { $cont: v } }],
                },
              });
            }}
          />
        </div>
      }
      className={style['wapper']}
      loading={fetchActionsLoading}
      // loading={getActionsQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {actions?.data && (
        <TableCard selectedRowKeys={selectedRowKeys} totalLength={actions.total}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns as any}
            dataSource={actions.data}
            pagination={{
              defaultCurrent: actionsQuery.page,
              defaultPageSize: actionsQuery?.limit,
              total: actions.total,
              current: actions.page,
              pageSize: actionsQuery?.limit,
              //
              pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
              showSizeChanger: true,
            }}
            onChange={(pagination, filters, sorter: any) => {
              fetchActions({
                ...actionsQuery,
                page: pagination.current,
                limit: pagination.pageSize,
                sort: formatOrderSortByPagination(sorter),
              });
            }}
          />
        </TableCard>
      )}
    </PageCard>
  );
};
