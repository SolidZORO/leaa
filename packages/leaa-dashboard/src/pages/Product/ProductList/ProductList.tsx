import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Table, Icon, Tag } from 'antd';

import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON } from '@leaa/dashboard/src/constants';
import { GET_PRODUCTS, DELETE_PRODUCT, UPDATE_PRODUCT } from '@leaa/common/src/graphqls';
import { Product, Tag as TagEntry } from '@leaa/common/src/entrys';
import { IOrderSort } from '@leaa/common/src/dtos/_common';
import { ProductsWithPaginationObject, ProductsArgs } from '@leaa/common/src/dtos/product';
import { urlUtil, tableUtil, messageUtil } from '@leaa/dashboard/src/utils';
import { IPage } from '@leaa/dashboard/src/interfaces';

import {
  PageCard,
  HtmlMeta,
  SearchInput,
  TableCard,
  TableColumnId,
  TableColumnDate,
  TableColumnDeleteButton,
  SelectCategoryIdByTree,
  TagSearchBox,
  TableColumnStatusSwitch,
  PriceTag,
} from '@leaa/dashboard/src/components';

import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const urlParams = queryString.parse(window.location.search);
  const urlPagination = urlUtil.getPagination(urlParams);

  const [q, setQ] = useState<string | undefined>(urlParams.q ? `${urlParams.q}` : undefined);
  const [page, setPage] = useState<number | undefined>(urlPagination.page);
  const [pageSize, setPageSize] = useState<number | undefined>(urlPagination.pageSize);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>([]);
  const [tagName, setTagName] = useState<string | undefined>(
    urlParams && urlParams.tagName ? `${urlParams.tagName}` : undefined,
  );
  const [categoryId, setCategoryId] = useState<number | undefined>(
    urlParams && urlParams.categoryId ? Number(urlParams.categoryId) : undefined,
  );

  // sort
  const [orderBy, setOrderBy] = useState<string | undefined>(urlParams.orderBy ? `${urlParams.orderBy}` : undefined);
  const [orderSort, setOrderSort] = useState<IOrderSort | undefined>(
    urlParams.orderSort ? urlUtil.formatOrderSort(`${urlParams.orderSort}`) : undefined,
  );

  // query
  const getProductsVariables = { page, pageSize, q, orderBy, orderSort, tagName };
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
    setPage(urlPagination.page);
    setPageSize(urlPagination.pageSize);
    setOrderBy(undefined);
    setOrderSort(undefined);
    setQ(undefined);
    setTagName(undefined);
    setCategoryId(undefined);
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
    onChange: (keys: number[] | string[]) => setSelectedRowKeys(keys),
    selectedRowKeys,
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'id'),
      render: (id: string) => <TableColumnId id={id} link={`${props.route.path}/${id}`} />,
    },
    {
      title: t('_lang:name'),
      dataIndex: 'name',
      sorter: true,
      sortOrder: tableUtil.calcDefaultSortOrder(orderSort, orderBy, 'title'),
      render: (text: string, record: Product) => (
        <>
          <Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>
          <small className={style['col-slug']}>{record.serial}</small>

          {record.tags && record.tags.length > 0 && (
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
      title: t('_lang:serial'),
      dataIndex: 'serial',
      width: 100,
      render: (text: string, record: Product) => <span>{record.serial ? record.serial : '----'}</span>,
    },
    {
      title: t('_lang:price'),
      dataIndex: 'price',
      render: (text: string, record: Product) => <PriceTag amount={record && record.price} size="small" />,
    },
    {
      title: t('_page:Product.Component.style'),
      dataIndex: 'style',
      width: 100,
      render: (text: string, record: Product) => (
        <span>{record.styles && record.styles.length ? record.styles[0].name : '----'}</span>
      ),
    },
    {
      title: t('_page:Product.Component.brand'),
      dataIndex: 'brand',
      width: 100,
      render: (text: string, record: Product) => (
        <span>{record.brands && record.brands.length ? record.brands[0].name : '----'}</span>
      ),
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
      title: t('_page:Product.Component.putOnSale'),
      dataIndex: 'status',
      width: 60,
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
    setPage(1);

    const filterParams: { q?: string; categoryId?: number; tagName?: string } = {};

    if (params.field === 'q') {
      setQ(params.value);
      filterParams.q = params.value;
    }

    if (params.field === 'categoryId') {
      const v = Number.isNaN(params.value) ? undefined : params.value;

      setCategoryId(v);
      filterParams.categoryId = v;
    }

    if (params.field === 'tagName') {
      setTagName(params.value);
      filterParams.tagName = params.value;
    }

    urlUtil.mergeParamToUrlQuery({
      window,
      params: {
        page: 1,
        ...filterParams,
      },
      replace: true,
    });
  };

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
        <div className={style['filter-bar-wrapper']}>
          <Icon type="ri-filter-line" className={style['filter-bar-icon']} />

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
            onChange={(v: number | number[]) => onFilter({ field: 'categoryId', value: Number(v) })}
            value={categoryId || undefined}
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

      {getProductsQuery.data && getProductsQuery.data.products && getProductsQuery.data.products.items && (
        <TableCard selectedRowKeys={selectedRowKeys}>
          <Table
            rowKey="id"
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={getProductsQuery.data.products.items}
            pagination={{
              defaultCurrent: page,
              defaultPageSize: pageSize,
              total: getProductsQuery.data.products.total,
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
