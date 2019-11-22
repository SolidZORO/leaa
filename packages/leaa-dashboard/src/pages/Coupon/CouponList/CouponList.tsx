import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, Icon, message } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS } from '@leaa/dashboard/src/constants';
import { GET_COUPONS, DELETE_COUPON, UPDATE_COUPON, GET_COUPON } from '@leaa/common/src/graphqls';
import { Coupon } from '@leaa/common/src/entrys';
import { IOrderSort } from '@leaa/common/src/dtos/_common';
import { CouponsWithPaginationObject, CouponArgs } from '@leaa/common/src/dtos/coupon';
import { urlUtil, tableUtil } from '@leaa/dashboard/src/utils';
import { IPage } from '@leaa/dashboard/src/interfaces';

import {
  HtmlMeta,
  PageCard,
  ErrorCard,
  TableCard,
  SearchInput,
  TableColumnDeleteButton,
  TableColumnId,
  CouponItem,
  TableColumnStatusSwitch,
} from '@leaa/dashboard/src/components';

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
  const getCouponsVariables = { page, pageSize, q, orderBy, orderSort };
  const getCouponsQuery = useQuery<{ coupons: CouponsWithPaginationObject }, CouponArgs>(GET_COUPONS, {
    variables: getCouponsVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [deleteCouponMutate, deleteCouponMutation] = useMutation<Coupon>(DELETE_COUPON, {
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_COUPONS, variables: getCouponsVariables }],
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
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'id'),
      render: (text: string) => <TableColumnId id={text} />,
    },
    {
      title: t('_page:Coupon.Component.code'),
      dataIndex: 'code',
      width: 180,
      render: (text: string, record: Coupon) => (
        <CouponItem
          item={record}
          size="small"
          name={<Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>}
        />
      ),
    },

    {
      title: t('_lang:status'),
      dataIndex: 'status',
      width: 50,
      render: (text: string, record: Coupon) => (
        <TableColumnStatusSwitch
          id={Number(record.id)}
          value={Number(record.status)}
          size="small"
          variablesField="coupon"
          mutation={UPDATE_COUPON}
          refetchQueries={[{ query: GET_COUPONS, variables: getCouponsVariables }]}
        />
      ),
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Coupon) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.code}
          loading={deleteCouponMutation.loading}
          onClick={async () => deleteCouponMutate({ variables: { id: Number(record.id) } })}
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
      loading={getCouponsQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getCouponsQuery.error ? <ErrorCard error={getCouponsQuery.error} /> : null}
      {deleteCouponMutation.error ? <ErrorCard error={deleteCouponMutation.error} /> : null}

      {getCouponsQuery.data && getCouponsQuery.data.coupons && getCouponsQuery.data.coupons.items && (
        <TableCard selectedRowKeys={selectedRowKeys}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={getCouponsQuery.data.coupons.items}
            pagination={{
              defaultCurrent: page,
              defaultPageSize: pageSize,
              total: getCouponsQuery.data.coupons.total,
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
