import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { TreeSelectProps } from 'antd/lib/tree-select';

import { GET_CATEGORIES } from '@leaa/dashboard/src/graphqls';
import { CategoriesArgs, CategoriesWithPaginationOrTreeObject } from '@leaa/common/src/dtos/category';

import style from './style.module.less';

interface IProps {
  value?: string | string[] | null;
  initialValues?: string | string[] | null;
  className?: string;
  onChange?: (value?: string | string[] | null) => void;
  multipleSelect?: boolean;
  componentProps?: TreeSelectProps<any>;
  parentId?: string;
  parentSlug?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

export const SelectCategoryIdByTree = (props: IProps) => {
  const { t } = useTranslation();

  // query
  const getCategoriesVariables: CategoriesArgs = {
    expanded: true,
    treeType: true,
    parentId: props.parentId,
    parentSlug: props.parentSlug,
  };

  const getCategoriesQuery = useQuery<{ categories: CategoriesWithPaginationOrTreeObject }, CategoriesArgs>(
    GET_CATEGORIES,
    {
      variables: getCategoriesVariables,
      fetchPolicy: 'network-only',
    },
  );

  const [value, setValue] = useState<string | string[] | undefined | null>(props.value || props.initialValues);

  const onChange = (v?: string | string[] | null) => {
    setValue(v);

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

  const onCalcTreeData = () => {
    if (getCategoriesQuery.data?.categories?.trees?.length) {
      return getCategoriesQuery.data.categories.trees;
    }

    return [];
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <TreeSelect
        {...multipleSelectOption}
        loading={getCategoriesQuery.loading}
        // TIPS: waiting data then select (fix only show number)
        value={value || '----'}
        treeDefaultExpandAll
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={onCalcTreeData()}
        placeholder={props.placeholder || t('_lang:category')}
        onChange={onChange}
        className={style['tree-select-wrapper']}
        style={props.style}
        {...props.componentProps}
      />
    </div>
  );
};
