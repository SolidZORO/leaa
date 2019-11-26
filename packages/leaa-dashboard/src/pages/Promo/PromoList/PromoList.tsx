import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, Icon, message } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/src/constants';
import { GET_PROMOS, DELETE_PROMO, UPDATE_PROMO } from '@leaa/common/src/graphqls';
import { Promo, Ax } from '@leaa/common/src/entrys';
import { IOrderSort } from '@leaa/common/src/dtos/_common';
import { PromosWithPaginationObject, PromoArgs } from '@leaa/common/src/dtos/promo';
import { urlUtil, tableUtil } from '@leaa/dashboard/src/utils';
import {
  TableColumnDate,
  HtmlMeta,
  PageCard,
  ErrorCard,
  TableCard,
  SearchInput,
  TableColumnDeleteButton,
  TableColumnId,
  TableColumnStatusSwitch,
  CouponItem,
} from '@leaa/dashboard/src/components';
import { IPage } from '@leaa/dashboard/src/interfaces';

import style from './style.module.less';

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
  const getPromosVariables = { page, pageSize, q, orderBy, orderSort };
  const getPromosQuery = useQuery<{ promos: PromosWithPaginationObject }, PromoArgs>(GET_PROMOS, {
    variables: getPromosVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [deletePromoMutate, deletePromoMutation] = useMutation<Promo>(DELETE_PROMO, {
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_PROMOS, variables: getPromosVariables }],
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
      width: 100,
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'id'),
      render: (text: string) => <TableColumnId id={text} />,
    },
    {
      title: t('_page:Promo.Component.promoInfo'),
      dataIndex: 'name',
      render: (text: string, record: Promo) => (
        <CouponItem
          type="promo"
          item={record}
          size="small"
          name={<Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>}
        />
      ),
    },
    {
      title: `${t('_lang:quantity')} / ${t('_page:Promo.Component.redeemedQuantity')}`,
      dataIndex: 'quantity',
      width: 200,
      render: (text: string, record: Promo) => (
        <div>
          {record.quantity} / {record.redeemed_quantity}
        </div>
      ),
    },
    {
      title: t('_lang:status'),
      dataIndex: 'status',
      width: 60,
      render: (text: string, record: Promo) => (
        <TableColumnStatusSwitch
          id={Number(record.id)}
          value={Number(record.status)}
          size="small"
          variablesField="promo"
          mutation={UPDATE_PROMO}
          refetchQueries={[{ query: GET_PROMOS, variables: getPromosVariables }]}
        />
      ),
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Promo) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.name}
          loading={deletePromoMutation.loading}
          onClick={async () => deletePromoMutate({ variables: { id: Number(record.id) } })}
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
      loading={getPromosQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getPromosQuery.error ? <ErrorCard error={getPromosQuery.error} /> : null}
      {deletePromoMutation.error ? <ErrorCard error={deletePromoMutation.error} /> : null}

      {getPromosQuery.data && getPromosQuery.data.promos && getPromosQuery.data.promos.items && (
        <TableCard selectedRowKeys={selectedRowKeys}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={getPromosQuery.data.promos.items}
            pagination={{
              defaultCurrent: page,
              defaultPageSize: pageSize,
              total: getPromosQuery.data.promos.total,
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
