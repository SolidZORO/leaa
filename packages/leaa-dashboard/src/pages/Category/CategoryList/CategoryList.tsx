import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Button, Icon } from 'antd';
import SortableTree, { TreeItem } from 'react-sortable-tree';

import { PAGE_CARD_TITLE_CREATE_ICON, CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { DELETE_CATEGORY, GET_CATEGORIES } from '@leaa/common/src/graphqls';
import { Category } from '@leaa/common/src/entrys';
import { CategoriesWithPaginationOrTreeObject, CategoriesArgs } from '@leaa/common/src/dtos/category';
import { messageUtil } from '@leaa/dashboard/src/utils';
import { IPage } from '@leaa/dashboard/src/interfaces';

import { HtmlMeta, PageCard, TableCard, TableColumnDeleteButton } from '@leaa/dashboard/src/components';

import 'react-sortable-tree/style.css';
import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  const [treeData, setTreeData] = useState<TreeItem[]>([]);

  const getCategoriesVariables: CategoriesArgs = { expanded: true, treeType: true };
  const getCategoriesQuery = useQuery<{ categories: CategoriesWithPaginationOrTreeObject }, CategoriesArgs>(
    GET_CATEGORIES,
    {
      variables: getCategoriesVariables,
      fetchPolicy: 'network-only',
    },
  );

  // mutation
  const [deleteCategoryMutate, deleteCategoryMutation] = useMutation<Category>(DELETE_CATEGORY, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => messageUtil.gqlCompleted(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_CATEGORIES, variables: getCategoriesVariables }],
  });

  useEffect(() => {
    if (
      getCategoriesQuery &&
      getCategoriesQuery.data &&
      getCategoriesQuery.data.categories &&
      getCategoriesQuery.data.categories.trees
    ) {
      // setTreeData(JSON.parse(getCategoriesQuery.data.categories.treeByStringify));
      setTreeData(getCategoriesQuery.data.categories.trees);
    }
  }, [
    getCategoriesQuery &&
      getCategoriesQuery.data &&
      getCategoriesQuery.data.categories &&
      getCategoriesQuery.data.categories.trees,
  ]);

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
      className={style['wapper']}
      loading={getCategoriesQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <TableCard>
        <div style={{ height: '70vh' }}>
          <SortableTree
            className={style['tree-wrapper']}
            isVirtualized={false}
            canDrag={false}
            treeData={treeData}
            onChange={e => setTreeData(e)}
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
                  loading={deleteCategoryMutation.loading}
                  onClick={async () => deleteCategoryMutate({ variables: { id: Number(node.id) } })}
                  className={style['tree-item-delete-button']}
                />,
                <Button key={`${node.id}`} title={_.toString(node)} size="small">
                  <Link to={`/categories/create?parent_id=${node.id}`}>
                    <Icon type={CREATE_BUTTON_ICON} />
                  </Link>
                </Button>,
                <span key={`${node.id}`}>&nbsp;</span>,
              ],
            })}
          />
        </div>
      </TableCard>
    </PageCard>
  );
};
