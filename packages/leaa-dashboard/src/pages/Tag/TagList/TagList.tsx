import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table } from 'antd';

import { Tag } from '@leaa/common/src/entrys';
import { envConfig } from '@leaa/dashboard/src/configs';
import { DEFAULT_PAGE_SIZE_OPTIONS, PAGE_CARD_TITLE_CREATE_ICON, DEFAULT_QUERY } from '@leaa/dashboard/src/constants';
import {
  IPage,
  IKey,
  ICrudListQueryParams,
  ITableColumns,
  IHttpRes,
  ICrudRes,
  IHttpError,
} from '@leaa/dashboard/src/interfaces';
import {
  ajax,
  errorMsg,
  setCrudQueryToUrl,
  formatOrderSort,
  calcTableSortOrder,
  transUrlQueryToCrudState,
  genCrudRequestQuery,
  genCrudQuerySearch,
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
  TableColumnDate,
} from '@leaa/dashboard/src/components';

import style from './style.module.less';

const ROUTE_NAME = 'tags';

export default (props: IPage) => {
  const { t } = useTranslation();

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCrudState(window),
  });

  const [listLoading, setListLoading] = useState(false);

  const [list, setList] = useState<ICrudRes<Tag>>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<IKey[]>([]);

  const fetchList = (params: ICrudListQueryParams) => {
    setCrudQuery(params);
    setListLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${ROUTE_NAME}`, { params: genCrudRequestQuery(params) })
      .then((res: IHttpRes<ICrudRes<Tag>>) => {
        setList(res.data.data);

        setCrudQueryToUrl({ window, query: params, replace: true });
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
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
      title: t('_lang:name'),
      dataIndex: 'name',
      sorter: true,
      sortOrder: calcTableSortOrder('name', crudQuery.sort),
      render: (text: string, record: Tag) => <Link to={`${props.route.path}/${record.id}`}>{record.name}</Link>,
    },
    {
      title: t('_lang:description'),
      dataIndex: 'description',
      sorter: true,
      sortOrder: calcTableSortOrder('description', crudQuery.sort),
      render: (text: string, record: Tag) => record.description,
    },
    {
      title: t('_lang:views'),
      dataIndex: 'views',
      width: 100,
      render: (text: string, record: Tag) => <small className="g-col-number">{record.views}</small>,
    },
    {
      title: t('_lang:createdAt'),
      dataIndex: 'created_at',
      sorter: true,
      sortOrder: calcTableSortOrder('created_at', crudQuery.sort),
      render: (text: string) => <TableColumnDate date={text} size="small" />,
    },
    {
      title: t('_lang:action'),
      dataIndex: 'operation',
      width: 60,
      render: (text: string, record: Tag) => (
        <TableColumnDeleteButton
          id={record.id}
          fieldName={record.name}
          routerName={ROUTE_NAME}
          onSuccessCallback={() => fetchList(transUrlQueryToCrudState(window))}
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
            crudQuery={crudQuery}
            clear={['q', 'search', 'categoryId']}
            onClose={(query: any) => setCrudQuery(query)}
          />

          <SearchInput
            className={cx('g-extra-filter-bar--item', 'g-extra-filter-bar--q')}
            value={crudQuery.q}
            onSearch={(q?: string) => {
              return setCrudQuery({
                ...crudQuery,
                search: genCrudQuerySearch(q, {
                  crudQuery,
                  condition: { $and: [{ $or: [{ name: { $cont: q } }] }] },
                  clear: { $and: [{ $or: undefined }] },
                }),
                q: q || undefined,
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
