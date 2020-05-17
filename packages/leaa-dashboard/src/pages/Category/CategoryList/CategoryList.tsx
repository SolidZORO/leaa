import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import SortableTree, { TreeItem } from 'react-sortable-tree';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PAGE_CARD_TITLE_CREATE_ICON, CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { ajax, errorMsg } from '@leaa/dashboard/src/utils';
import { IPage, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { ICategoriesQuery } from '@leaa/api/src/interfaces';

import { HtmlMeta, PageCard, TableColumnDeleteButton, Rcon } from '@leaa/dashboard/src/components';

import 'react-sortable-tree/style.css';
import style from './style.module.less';

const ROUTE_NAME = 'categories';

export default (props: IPage) => {
  const { t } = useTranslation();

  const [tree, setTree] = useState<TreeItem[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);

  const fetchList = (params: ICategoriesQuery = { expanded: true }) => {
    setTreeLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${ROUTE_NAME}/tree`, { params })
      .then((res: IHttpRes<TreeItem[]>) => {
        setTree(res.data?.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setTreeLoading(false));
  };

  useEffect(() => fetchList(), []);

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
      className={style['wapper']}
      loading={treeLoading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <div style={{ height: '70vh' }}>
        <SortableTree
          className={style['tree-wrapper']}
          isVirtualized={false}
          canDrag={false}
          treeData={tree}
          onChange={(e) => setTree(e)}
          generateNodeProps={({ node }) => ({
            className: style['tree-item'],
            title: [
              <div className={style['tree-item-title']} key={`${node.id}`}>
                {node.id ? <Link to={`/categories/${node.id}`}>{node.title}</Link> : node.title}
              </div>,
            ],
            subtitle: [
              <div className={style['tree-item-sub-title']} key={`${node.id}`}>
                {node.slug}
                <small>#{node.id}</small>
              </div>,
            ],
            buttons: [
              <TableColumnDeleteButton
                key={`${node.id}`}
                size="small"
                id={node.id}
                fieldName={node.name}
                routerName={ROUTE_NAME}
                onSuccessCallback={() => fetchList()}
                className={style['tree-item-delete-button']}
              />,
              <Button key={`${node.id}`} title={_.toString(node)} size="small">
                <Link to={`/categories/create?parent_id=${node.id}`}>
                  <Rcon type={CREATE_BUTTON_ICON} />
                </Link>
              </Button>,
              <span key={`${node.id}`}>&nbsp;</span>,
            ],
          })}
        />
      </div>
    </PageCard>
  );
};
