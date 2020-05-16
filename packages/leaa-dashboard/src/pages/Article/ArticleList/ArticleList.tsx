import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table } from 'antd';

import { Article } from '@leaa/common/src/entrys';
import { envConfig } from '@leaa/dashboard/src/configs';
import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON, DEFAULT_QUERY } from '@leaa/dashboard/src/constants';
import {
  IPage,
  IKey,
  ICrudListQueryParams,
  ITableColumns,
  IHttpRes,
  ICurdRes,
  IHttpError,
} from '@leaa/dashboard/src/interfaces';
import {
  ajax,
  errorMsg,
  setCurdQueryToUrl,
  formatOrderSort,
  calcTableSortOrder,
  transUrlQueryToCurdState,
  genFuzzySearchByQ,
  genCurdRequestQuery,
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
  TagMiniSets,
  TableColumnStatusSwitch,
  TableColumnDate,
  SelectCategoryIdByTree,
} from '@leaa/dashboard/src/components';

import style from './style.module.less';

const ROUTE_NAME = 'articles';

export default (props: IPage) => {
  const { t } = useTranslation();

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCurdState(window),
  });

  const [listLoading, setListLoading] = useState(false);

  const [list, setList] = useState<ICurdRes<Article>>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<IKey[]>([]);

  const fetchList = (params: ICrudListQueryParams) => {
    setCrudQuery(params);
    setListLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${ROUTE_NAME}`, { params: { params: genCurdRequestQuery(params) } })
      .then((res: IHttpRes<ICurdRes<Article>>) => {
        setList(res.data.data);

        setCurdQueryToUrl({ window, query: params, replace: true });
      })
      .catch((err: AxiosError<IHttpError>) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setListLoading(false));
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
      title: t('_lang:title'),
      dataIndex: 'title',
      sorter: true,
      sortOrder: calcTableSortOrder('title', crudQuery.sort),
      render: (text: string, record: Article) => (
        <>
          <Link to={`${props.route.path}/${record.id}`}>{record.title}</Link>
          <small className={style['col-slug']}>{record.slug}</small>

          <TagMiniSets tags={record.tags} />
        </>
      ),
    },
    {
      title: t('_lang:category'),
      dataIndex: 'category',
      width: 100,
      render: (text: string, record: Article) => (
        <span>{record.categories && record.categories.length > 0 ? record.categories[0].name : '----'}</span>
      ),
    },
    {
      title: t('_lang:createdAt'),
      dataIndex: 'created_at',
      sorter: true,
      sortOrder: calcTableSortOrder('created_at', crudQuery.sort),
      render: (text: string) => <TableColumnDate date={text} size="small" />,
    },
    {
      title: t('_lang:status'),
      dataIndex: 'status',
      width: 60,
      render: (text: string, record: Article) => (
        <TableColumnStatusSwitch id={record.id} value={record.status} routerName={ROUTE_NAME} size="small" />
      ),
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Article) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.title}
          routerName={ROUTE_NAME}
          onSuccessCallback={() => fetchList(transUrlQueryToCurdState(window))}
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

          {/*<SelectCategoryIdByTree*/}
          {/*  className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--category')}*/}
          {/*  componentProps={{ allowClear: true }}*/}
          {/*  // onChange={v => onFilter({ field: 'categoryId', value: v })}*/}
          {/*  // value={categoryId || undefined}*/}
          {/*  parentSlug="articles"*/}
          {/*/>*/}

          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={crudQuery.q}
            onSearch={(s?: string) => {
              return setCrudQuery({
                ...DEFAULT_QUERY,
                q: s,
                search: genFuzzySearchByQ(s, { type: '$or', fields: ['title'] }),
              });
            }}
          />
        </div>
      }
      className={style['wapper']}
      loading={listLoading}
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
