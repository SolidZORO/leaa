import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { useTranslation } from 'react-i18next';
import { TreeSelectProps } from 'antd/es/tree-select';

import { ICategoriesQuery } from '@leaa/api/src/interfaces';
import { ajax, errorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { TreeItem } from 'react-sortable-tree';

import style from './style.module.less';

interface IProps {
  value?: string | string[] | null;
  initialValues?: string | string[] | null;
  className?: string;
  // onChange?: (value?: string | string[] | null) => void;
  onChange?: (value?: any) => void;
  multipleSelect?: boolean;
  componentProps?: TreeSelectProps<any>;
  parentId?: string;
  parentSlug?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  dropdownWidth?: number;
}

export const SelectCategoryIdByTree = (props: IProps) => {
  const { t } = useTranslation();

  const [tree, setTree] = useState<TreeItem[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);

  const [value, setValue] = useState<string | string[] | undefined | null>(props.value || props.initialValues);

  const onFetchCategories = (params: ICategoriesQuery = { expanded: true, parentSlug: props?.parentSlug }) => {
    setTreeLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/categories/tree`, { params })
      .then((res: IHttpRes<TreeItem[]>) => {
        setTree(res.data?.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setTreeLoading(false));
  };

  const onChange = (v?: string | string[] | null) => {
    setValue(v || null);

    if (props.onChange) props.onChange(v);
  };

  useEffect(() => {
    if (props.initialValues) {
      onChange(props.value || props.initialValues);
    } else {
      setValue(props.value || props.initialValues);
    }
  }, [props.value]);

  const multipleSelectOption = props.multipleSelect
    ? {
        treeCheckable: true,
        // showCheckedStrategy: SHOW_PARENT,
        // multiple: true,
      }
    : {};

  useEffect(() => {
    onFetchCategories();

    return setTree([]);
  }, []);

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <TreeSelect
        {...multipleSelectOption}
        loading={treeLoading}
        // TIPS: value 即便是有值，也必须等待 tree query 完毕后才现实，不然 select 会被 uuid 撑开
        value={!_.isEmpty(tree) ? value : '----'}
        treeDefaultExpandAll
        dropdownClassName={style['tree-dropdown']}
        dropdownStyle={{ width: props.dropdownWidth || 'auto' }}
        dropdownMatchSelectWidth={false}
        treeData={tree as any}
        placeholder={props.placeholder || t('_lang:category')}
        onChange={onChange}
        className={style['tree-select-wrapper']}
        style={props.style}
        {...props.componentProps}
      />
    </div>
  );
};
