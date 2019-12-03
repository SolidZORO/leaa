import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, Icon, Button } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
import { GET_COUPONS, DELETE_COUPON, UPDATE_COUPON } from '@leaa/common/src/graphqls';
import { Coupon } from '@leaa/common/src/entrys';
import { IOrderSort } from '@leaa/common/src/dtos/_common';
import { CouponsWithPaginationObject, CouponArgs } from '@leaa/common/src/dtos/coupon';
import { urlUtil, tableUtil, messageUtil } from '@leaa/dashboard/src/utils';

import { IPage } from '@leaa/dashboard/src/interfaces';

import {
  HtmlMeta,
  PageCard,
  TableCard,
  SearchInput,
  TableColumnDeleteButton,
  TableColumnId,
  CouponItem,
  TableColumnStatusSwitch,
  IdTag,
  TableColumnDate,
  UserSearchBox,
} from '@leaa/dashboard/src/components';

import { RedeemCouponToUseButton } from '../_components/RedeemCouponToUseButton/RedeemCouponToUseButton';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = urlUtil.getPagination(urlParams);

  const [q, setQ] = useState<string | undefined>(urlParams.q ? `${urlParams.q}` : undefined);
  const [page, setPage] = useState<number | undefined>(urlPagination.page);
  const [pageSize, setPageSize] = useState<number | undefined>(urlPagination.pageSize);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>([]);

  // sort
  const [orderBy, setOrderBy] = useState<string | undefined>(urlParams.orderBy ? `${urlParams.orderBy}` : undefined);
  const [orderSort, setOrderSort] = useState<IOrderSort | undefined>(
    urlParams.orderSort ? urlUtil.formatOrderSort(`${urlParams.orderSort}`) : undefined,
  );

  // filter
  const [userId, setUserId] = useState<number | undefined>(urlParams.userId ? Number(urlParams.userId) : undefined);

  // query
  const getCouponsVariables = { page, pageSize, q, orderBy, orderSort, userId };
  const getCouponsQuery = useQuery<{ coupons: CouponsWithPaginationObject }, CouponArgs>(GET_COUPONS, {
    variables: getCouponsVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [deleteCouponMutate, deleteCouponMutation] = useMutation<Coupon>(DELETE_COUPON, {
    onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlCompleted(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_COUPONS, variables: getCouponsVariables }],
  });

  const resetUrlParams = () => {
    setPage(urlPagination.page);
    setPageSize(urlPagination.pageSize);
    setOrderBy(undefined);
    setOrderSort(undefined);
    setQ(undefined);
    setUserId(undefined);
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
      render: (id: string) => <TableColumnId id={id} link={`${props.route.path}/${id}`} />,
    },
    {
      title: t('_page:Coupon.Component.couponInfo'),
      dataIndex: 'code',
      render: (text: string, record: Coupon) => (
        <CouponItem
          type="coupon"
          item={record}
          size="small"
          name={<Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>}
        />
      ),
    },
    {
      title: t('_page:Coupon.Component.redeemUser'),
      dataIndex: 'user_id',
      width: 100,
      render: (text: string, record: Coupon) => <RedeemCouponToUseButton item={record} />,
    },
    {
      title: t('_page:Coupon.Component.accessOrder'),
      dataIndex: 'order_id',
      width: 100,
      render: (text: string, record: Coupon) => <IdTag id={record.order_id} link={`/orders/${record.order_id}`} />,
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
          <Icon type={props.route.icon} />
          <strong>{t(`${props.route.namei18n}`)}</strong>
          <Link className="page-card-create-link" to={`${props.route.path}/create`}>
            <Icon type={PAGE_CARD_TITLE_CREATE_ICON} />
          </Link>
        </span>
      }
      extra={
        <div className={style['extra-wrapper']}>
          <Link to={`${props.route.path}/redeem`}>
            <Button size="small" icon="ri-swap-box-line" type="link" className={style['redeem-button']}>
              {t('_page:Coupon.Component.redeem')}
            </Button>
          </Link>

          <UserSearchBox
            className={style['user-search-box']}
            useOnBlur
            defaultValue={userId}
            onSelectUserCallback={user => {
              urlUtil.mergeParamToUrlQuery({
                window,
                params: {
                  page: 1,
                  userId: user && user.id,
                },
                replace: true,
              });

              setUserId(user && user.id);
            }}
            style={{ width: 200 }}
          />

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
      loading={getCouponsQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

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
