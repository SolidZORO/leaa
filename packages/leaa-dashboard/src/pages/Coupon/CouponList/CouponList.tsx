import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, Button } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
import { GET_COUPONS, DELETE_COUPON, UPDATE_COUPON } from '@leaa/dashboard/src/graphqls';

import { Coupon } from '@leaa/common/src/entrys';
import { CouponsWithPaginationObject, CouponsArgs } from '@leaa/common/src/dtos/coupon';
import { IPage, IKey, ITablePagination } from '@leaa/dashboard/src/interfaces';
import {
  mergeParamToUrlQuery,
  getPaginationByUrl,
  pickPaginationByUrl,
  pickOrderByByUrl,
  formatOrderSortByUrl,
  formatOrderByByUrl,
  initPaginationStateByUrl,
  calcTableDefaultSortOrder,
  successMessage,
} from '@leaa/dashboard/src/utils';

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
  CouponItem,
  IdTag,
  UserSearchBox,
} from '@leaa/dashboard/src/components';

import { RedeemCouponToUseButton } from '../_components/RedeemCouponToUseButton/RedeemCouponToUseButton';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = getPaginationByUrl(urlParams);

  const [tablePagination, setTablePagination] = useState<ITablePagination>(initPaginationStateByUrl(urlParams));
  const [selectedRowKeys, setSelectedRowKeys] = useState<IKey[]>([]);

  // filter
  const [q, setQ] = useState<string | undefined>(urlParams.q ? String(urlParams.q) : undefined);
  const [userId, setUserId] = useState<string | undefined>(urlParams.userId ? String(urlParams.userId) : undefined);

  // query
  const getCouponsVariables = { ...tablePagination, q };
  const getCouponsQuery = useQuery<{ coupons: CouponsWithPaginationObject }, CouponsArgs>(GET_COUPONS, {
    variables: getCouponsVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [deleteCouponMutate, deleteCouponMutation] = useMutation<Coupon>(DELETE_COUPON, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => successMessage(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_COUPONS, variables: getCouponsVariables }],
  });

  const resetUrlParams = () => {
    setTablePagination({
      page: urlPagination.page,
      pageSize: urlPagination.pageSize,
      orderBy: undefined,
      orderSort: undefined,
    });

    setQ(undefined);
    setUserId(undefined);
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
      width: 75, // ID
      sorter: true,
      sortOrder: calcTableDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'id'),
      render: (id: string) => <TableColumnId id={id} link={`${props.route.path}/${id}`} />,
    },
    {
      title: t('_page:Coupon.couponInfo'),
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
      title: t('_page:Coupon.redeemUser'),
      dataIndex: 'user_id',
      width: 100,
      render: (text: string, record: Coupon) => <RedeemCouponToUseButton item={record} />,
    },
    {
      title: t('_page:Coupon.accessOrder'),
      dataIndex: 'order_id',
      width: 100,
      render: (text: string, record: Coupon) => <IdTag id={record.order_id} link={`/orders/${record.order_id}`} />,
    },
    {
      title: t('_lang:createdAt'),
      dataIndex: 'created_at',
      width: 120,
      sorter: true,
      sortOrder: calcTableDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'created_at'),
      render: (text: string) => <TableColumnDate date={text} size="small" />,
    },
    {
      title: t('_lang:status'),
      dataIndex: 'status',
      width: 60,
      render: (text: string, record: Coupon) => (
        <TableColumnStatusSwitch
          id={record.id}
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
          onClick={async () => deleteCouponMutate({ variables: { id: record.id } })}
        />
      ),
    },
  ];

  const onFilter = (params: { field: string; value?: string | number | number[] }) => {
    setTablePagination({ ...tablePagination, page: 1 });

    const filterParams: { q?: string; userId?: string } = {};

    if (params.field === 'q') {
      const result = params.value ? String(params.value) : undefined;

      setQ(result);
      filterParams.q = result;
    }

    if (params.field === 'userId') {
      // TIPS: AutoComplete will be a String
      const result = params.value ? String(params.value) : undefined;

      setUserId(result);
      filterParams.userId = result;
    }

    mergeParamToUrlQuery({
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
          {props.route.canCreate && (
            <Link className="g-page-card-create-link" to={`${props.route.path}/create`}>
              <Rcon type={PAGE_CARD_TITLE_CREATE_ICON} />
            </Link>
          )}
        </span>
      }
      extra={
        <div className="g-page-card-extra-filter-bar-wrapper">
          <Link to={`${props.route.path}/redeem`}>
            <Button size="small" icon={<Rcon type="ri-swap-box-line" />} type="link" className={style['redeem-button']}>
              {t('_page:Coupon.redeem')}
            </Button>
          </Link>

          <UserSearchBox
            className={cx('g-extra-filter-bar--item')}
            useOnBlur
            onSelectUserCallback={(user) => onFilter({ field: 'userId', value: user && user.id })}
            value={userId}
          />

          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={q}
            onChange={(v) => onFilter({ field: 'q', value: v })}
          />
        </div>
      }
      className={style['wapper']}
      loading={getCouponsQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getCouponsQuery?.data?.coupons?.items && (
        <TableCard selectedRowKeys={selectedRowKeys} totalLength={getCouponsQuery.data.coupons.total}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns as any}
            dataSource={getCouponsQuery.data.coupons.items}
            pagination={{
              defaultCurrent: tablePagination.page,
              defaultPageSize: tablePagination.pageSize,
              total: getCouponsQuery.data.coupons.total,
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
                orderBy: formatOrderByByUrl(sorter.field),
                orderSort: formatOrderSortByUrl(sorter.order),
              });

              mergeParamToUrlQuery({
                window,
                params: {
                  ...pickPaginationByUrl(pagination),
                  ...pickOrderByByUrl(sorter),
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
