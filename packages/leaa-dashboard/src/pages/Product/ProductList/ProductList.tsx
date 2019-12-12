import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, Tag } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
import { GET_PRODUCTS, DELETE_PRODUCT, UPDATE_PRODUCT } from '@leaa/common/src/graphqls';

import { Product, Tag as TagEntry } from '@leaa/common/src/entrys';
import { ProductsWithPaginationObject, ProductsArgs } from '@leaa/common/src/dtos/product';
import { IPage, IKey, ITablePagination } from '@leaa/dashboard/src/interfaces';
import { urlUtil, tableUtil, messageUtil } from '@leaa/dashboard/src/utils';

import {
  Rcon,
  PageCard,
  PriceTag,
  HtmlMeta,
  TableCard,
  FilterIcon,
  TagMiniSets,
  SearchInput,
  TagSearchBox,
  TableColumnId,
  TableColumnDate,
  TableColumnImage,
  SelectCategoryIdByTree,
  TableColumnDeleteButton,
  TableColumnStatusSwitch,
} from '@leaa/dashboard/src/components';

import style from './style.module.less';

export default (props: IPage) => {
  const { t, i18n } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = urlUtil.getPagination(urlParams);

  const [tablePagination, setTablePagination] = useState<ITablePagination>(urlUtil.initPaginationState(urlParams));

  const [q, setQ] = useState<string | undefined>(urlParams.q ? String(urlParams.q) : undefined);
  const [tagName, setTagName] = useState<string | undefined>(urlParams.tagName ? String(urlParams.tagName) : undefined);
  const [styleId, setStyleId] = useState<number | undefined>(urlParams.styleId ? Number(urlParams.styleId) : undefined);
  const [brandId, setBrandId] = useState<number | undefined>(urlParams.brandId ? Number(urlParams.brandId) : undefined);

  // query
  const getProductsVariables = { ...tablePagination, q, tagName, styleId, brandId };
  const getProductsQuery = useQuery<{ products: ProductsWithPaginationObject }, ProductsArgs>(GET_PRODUCTS, {
    variables: getProductsVariables,
  });

  // mutation
  const [deleteProductMutate, deleteProductMutation] = useMutation<Product>(DELETE_PRODUCT, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlSuccess(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_PRODUCTS, variables: getProductsVariables }],
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
    setTagName(undefined);
    setStyleId(undefined);
    setBrandId(undefined);
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
      title: t('_page:Product.banner'),
      width: 80,
      dataIndex: 'banner',
      render: (text: string, record: Product) => <TableColumnImage url={record.attachments?.bannerMbList[0]?.url} />,
    },
    {
      title: t('_page:Product.productName'),
      dataIndex: 'name',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'name'),
      render: (text: string, record: Product) => (
        <>
          <Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>
          <small className={style['col-slug']}>{record.serial}</small>

          <TagMiniSets tags={record.tags} />
        </>
      ),
    },
    {
      title: t('_lang:stock'),
      dataIndex: 'stock',
      width: 100,
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'stock'),
      render: (text: string, record: Product) => <span>{record.stock ? record.stock : '----'}</span>,
    },
    {
      title: t('_lang:price'),
      dataIndex: 'price',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'price'),
      render: (text: string, record: Product) => <PriceTag amount={record?.price} size="small" />,
    },
    {
      title: t('_page:Product.style'),
      dataIndex: 'style',
      width: 100,
      render: (text: string, record: Product) => <span>{record.styles?.length ? record.styles[0].name : '----'}</span>,
    },
    {
      title: t('_page:Product.brand'),
      dataIndex: 'brand',
      width: 100,
      render: (text: string, record: Product) => <span>{record.brands?.length ? record.brands[0].name : '----'}</span>,
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
      title: t('_page:Product.putOnSale'),
      dataIndex: 'status',
      width: i18n.language.includes('zh') ? 70 : 110,
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'status'),
      render: (text: string, record: Product) => (
        <TableColumnStatusSwitch
          id={Number(record.id)}
          value={Number(record.status)}
          size="small"
          variablesField="product"
          mutation={UPDATE_PRODUCT}
          refetchQueries={[{ query: GET_PRODUCTS, variables: getProductsVariables }]}
        />
      ),
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Product) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.name}
          loading={deleteProductMutation.loading}
          onClick={async () => deleteProductMutate({ variables: { id: Number(record.id) } })}
        />
      ),
    },
  ];

  const onFilter = (params: { field: string; value?: string | number | number[] }) => {
    setTablePagination({ ...tablePagination, page: 1 });

    const filterParams: { q?: string; styleId?: number; brandId?: number; tagName?: string } = {};

    if (params.field === 'q') {
      const result = params.value ? String(params.value) : undefined;

      setQ(result);
      filterParams.q = result;
    }

    if (params.field === 'tagName') {
      const result = params.value ? String(params.value) : undefined;

      setTagName(result);
      filterParams.tagName = result;
    }

    if (params.field === 'styleId') {
      const num = Number(params.value);
      const result = Number.isNaN(num) ? undefined : num;

      setStyleId(result);
      filterParams.styleId = result;
    }

    if (params.field === 'brandId') {
      const num = Number(params.value);
      const result = Number.isNaN(num) ? undefined : num;

      setBrandId(result);
      filterParams.brandId = result;
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
          <FilterIcon urlParams={urlParams} onClose={() => props.history.push('/products')} />

          <TagSearchBox
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--tag')}
            useOnBlur
            onSelectTagCallback={(v: TagEntry) => onFilter({ field: 'tagName', value: v.name })}
            onEnterCallback={v => onFilter({ field: 'tagName', value: v })}
            value={tagName}
            placeholder={t('_lang:tag')}
          />

          <SelectCategoryIdByTree
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--category')}
            componentProps={{ allowClear: true }}
            onChange={v => onFilter({ field: 'styleId', value: v })}
            value={styleId || undefined}
            parentSlug="products"
            placeholder={t('_page:Product.style')}
          />

          <SelectCategoryIdByTree
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--category')}
            componentProps={{ allowClear: true }}
            onChange={(v: number | number[]) => onFilter({ field: 'brandId', value: v })}
            value={brandId || undefined}
            parentSlug="brands"
            placeholder={t('_page:Product.brand')}
          />

          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={q}
            onChange={v => onFilter({ field: 'q', value: v })}
          />
        </div>
      }
      className={style['wapper']}
      loading={getProductsQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getProductsQuery?.data?.products?.items && (
        <TableCard selectedRowKeys={tablePagination.selectedRowKeys}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns as any}
            dataSource={getProductsQuery.data.products.items}
            pagination={{
              defaultCurrent: tablePagination.page,
              defaultPageSize: tablePagination.pageSize,
              total: getProductsQuery.data.products.total,
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
