import _ from 'lodash';
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
  SearchInput,
  TagSearchBox,
  TableColumnId,
  TableColumnDate,
  TableColumnImage,
  TableColumnDeleteButton,
  SelectCategoryIdByTree,
  TableColumnStatusSwitch,
} from '@leaa/dashboard/src/components';

import style from './style.module.less';

export default (props: IPage) => {
  const { t, i18n } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = urlUtil.getPagination(urlParams);

  const [tablePagination, setTablePagination] = useState<ITablePagination>({
    page: urlPagination?.page,
    pageSize: urlPagination?.pageSize,
    selectedRowKeys: [],
    orderBy: urlUtil.formatOrderBy(urlParams.orderBy),
    orderSort: urlUtil.formatOrderSort(urlParams.orderSort),
  });

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
    onCompleted: () => messageUtil.gqlCompleted(t('_lang:deletedSuccessfully')),
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
    if (_.isEmpty(urlParams)) {
      resetUrlParams();
    }
  }, [urlParams]);

  useEffect(() => {
    (async () => getProductsQuery.refetch())();
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
      title: t('_page:Product.Component.banner'),
      width: 80,
      dataIndex: 'banner',
      render: (text: string, record: Product) => <TableColumnImage url={record.attachments?.bannerMbList[0]?.url} />,
    },
    {
      title: t('_page:Product.Component.productName'),
      dataIndex: 'name',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'name'),
      render: (text: string, record: Product) => (
        <>
          <Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>
          <small className={style['col-slug']}>{record.serial}</small>

          {record.tags && record.tags?.length > 0 && (
            <small className={style['col-tags-wrapper']}>
              {record.tags.map(tag => (
                <Tag key={tag.name} className={style['col-tags-item']}>
                  {tag.name}
                </Tag>
              ))}
            </small>
          )}
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
      title: t('_page:Product.Component.style'),
      dataIndex: 'style',
      width: 100,
      render: (text: string, record: Product) => <span>{record.styles?.length ? record.styles[0].name : '----'}</span>,
    },
    {
      title: t('_page:Product.Component.brand'),
      dataIndex: 'brand',
      width: 100,
      render: (text: string, record: Product) => <span>{record.brands?.length ? record.brands[0].name : '----'}</span>,
    },
    {
      title: t('_lang:created_at'),
      dataIndex: 'created_at',
      width: 120,
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(tablePagination.orderSort, tablePagination.orderBy, 'created_at'),
      render: (text: string) => <TableColumnDate date={text} size="small" />,
    },
    {
      title: t('_page:Product.Component.putOnSale'),
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

  const onFilter = (params: { field: string; value: any }) => {
    setTablePagination({ ...tablePagination, page: 1 });

    const filterParams: { q?: string; styleId?: number; brandId?: number; tagName?: string } = {};

    if (params.field === 'q') {
      setQ(params.value);
      filterParams.q = params.value;
    }

    if (params.field === 'styleId') {
      const v = Number.isNaN(params.value) ? undefined : params.value;

      setStyleId(v);
      filterParams.styleId = v;
    }

    if (params.field === 'tagName') {
      setTagName(params.value);
      filterParams.tagName = params.value;
    }

    if (params.field === 'brandId') {
      setBrandId(params.value);
      filterParams.brandId = params.value;
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
          <Link className="page-card-create-link" to={`${props.route.path}/create`}>
            <Rcon type={PAGE_CARD_TITLE_CREATE_ICON} />
          </Link>
        </span>
      }
      extra={
        <div className={style['filter-bar-wrapper']}>
          <Rcon type="ri-filter-line" className={style['filter-bar-icon']} />

          <TagSearchBox
            className={style['filter-bar-tag']}
            useOnBlur
            onSelectTagCallback={(v: TagEntry) => onFilter({ field: 'tagName', value: v.name })}
            onEnterCallback={(v: string | undefined) => onFilter({ field: 'tagName', value: v })}
            value={tagName}
            placeholder={t('_lang:tag')}
          />

          <SelectCategoryIdByTree
            className={style['filter-bar-category']}
            componentProps={{ allowClear: true }}
            onChange={(v: number | number[]) => onFilter({ field: 'styleId', value: Number(v) })}
            value={styleId || undefined}
            parentSlug="products"
            placeholder={t('_page:Product.Component.style')}
          />

          <SelectCategoryIdByTree
            className={style['filter-bar-category']}
            componentProps={{ allowClear: true }}
            onChange={(v: number | number[]) => onFilter({ field: 'brandId', value: Number(v) })}
            value={brandId || undefined}
            parentSlug="brands"
            placeholder={t('_page:Product.Component.brand')}
          />

          <SearchInput
            className={style['filter-bar-search']}
            value={q}
            onChange={(v: string) => onFilter({ field: 'q', value: v })}
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
