import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button } from 'antd';
import SortableTree, { TreeItem, toggleExpandedForAll } from 'react-sortable-tree';

import { Division } from '@leaa/common/src/entrys';
import { msgMessage } from '@leaa/dashboard/src/utils';
import { PAGE_CARD_TITLE_CREATE_ICON, CREATE_BUTTON_ICON, UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { GET_DIVISIONS_TREE, DELETE_DIVISION } from '@leaa/dashboard/src/graphqls';
import { IPage } from '@leaa/dashboard/src/interfaces';

import { HtmlMeta, PageCard, TableColumnDeleteButton, Rcon } from '@leaa/dashboard/src/components';

import 'react-sortable-tree/style.css';
import style from './style.module.less';

export default (props: IPage) => {
  const { t } = useTranslation();

  // query
  const getDivisionMappingQuery = useQuery<{ divisionsTree: string }>(GET_DIVISIONS_TREE, {
    fetchPolicy: 'network-only',
  });

  // mutation
  const [deleteDivisionMutate, deleteDivisionMutation] = useMutation<Division>(DELETE_DIVISION, {
    // apollo-link-error onError: e => messageUtil.gqlError(e.message),
    onCompleted: () => msgMessage(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_DIVISIONS_TREE }],
  });

  const [divisionsTree, setDivisionsTree] = useState<TreeItem[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (getDivisionMappingQuery?.data?.divisionsTree) {
      setDivisionsTree(JSON.parse(getDivisionMappingQuery?.data?.divisionsTree));
    }
  }, [getDivisionMappingQuery?.data?.divisionsTree]);

  const buildCreateUrl = (node: any) => {
    let url = '';

    // Lv.1
    if (!node.province_code) {
      url = `province_code=${node.code ? node.code : ''}&city_code=${node.province_code ? node.province_code : ''}`;
    }

    // Lv.2
    if (node.province_code) {
      url = `province_code=${node.province_code ? node.province_code : ''}&city_code=${node.code ? node.code : ''}`;
    }

    return url;
  };

  const onExpandedForAll = () => {
    setDivisionsTree(toggleExpandedForAll({ treeData: divisionsTree, expanded: !expanded }));
    setExpanded(!expanded);
  };

  const onChangeTree = (tree: any) => {
    setDivisionsTree(tree);
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
        <>
          <Button onClick={onExpandedForAll} size="small">
            {expanded ? t('_page:Division.collapseAll') : t('_page:Division.expandedAll')}
          </Button>
        </>
      }
      className={style['wapper']}
      loading={getDivisionMappingQuery.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      <div style={{ height: '70vh' }}>
        {divisionsTree && (
          <SortableTree
            className={style['tree-wrapper']}
            canDrag={false}
            treeData={divisionsTree}
            onChange={onChangeTree}
            generateNodeProps={({ node }) => ({
              className: style['tree-item'],
              // title: node.title,
              buttons: [
                <TableColumnDeleteButton
                  key={`${node.id}`}
                  size="small"
                  id={node.id}
                  fieldName={node.name}
                  loading={deleteDivisionMutation.loading}
                  onClick={async () => deleteDivisionMutate({ variables: { id: node.id } })}
                  className={style['tree-item-delete-button']}
                />,
                <Button key={`${node.id}`} size="small" className={style['tree-item-edit-button']}>
                  <Link to={`/divisions/${node.id}`}>
                    <Rcon type={UPDATE_BUTTON_ICON} />
                  </Link>
                </Button>,
                <>
                  {!node.city_code && (
                    <Button key={`${node.id}`} size="small">
                      <Link to={`/divisions/create?${buildCreateUrl(node)}`}>
                        <Rcon type={CREATE_BUTTON_ICON} />
                      </Link>
                    </Button>
                  )}
                </>,
                <span key={`${node.id}`}>&nbsp;</span>,
              ],
            })}
          />
        )}
      </div>
    </PageCard>
  );
};
