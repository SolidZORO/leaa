import cx from 'classnames';
import React, { useState, useEffect, forwardRef } from 'react';
import { TreeSelect } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { TreeSelectProps } from 'antd/lib/tree-select';

import { GET_CATEGORIES } from '@leaa/common/src/graphqls';
import { CategoriesArgs, CategoriesWithPaginationOrTreeObject } from '@leaa/common/src/dtos/category';

import style from './style.module.less';

interface IProps {
  value?: number | number[] | undefined;
  className?: string;
  onChange?: (value: number | number[]) => void;
  multipleSelect?: boolean;
  componentProps?: TreeSelectProps<any>;
  parentId?: number;
  parentSlug?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

export const SelectCategoryIdByTree = forwardRef((props: IProps, ref: React.Ref<any>) => {
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
      // fetchPolicy: 'network-only',
    },
  );

  const getValue = (value: number | number[] | undefined) => {
    if (typeof value === 'undefined') return value;
    if (!props.multipleSelect) return Number(value);

    return value;
  };

  const [value, setValue] = useState<number | number[] | undefined>(getValue(props.value));

  useEffect(() => {
    setValue(getValue(props.value));
  }, [props.value]);

  const onChange = (v: number | number[]) => {
    const nextV = typeof v === 'number' ? Number(v) : v;

    setValue(nextV);

    if (props.onChange) {
      props.onChange(nextV);
    }
  };

  const multipleSelectOption = props.multipleSelect
    ? {
        treeCheckable: true,
        // showCheckedStrategy: SHOW_PARENT,
        // multiple: true,
      }
    : {};

  const onCalcValue = () => {
    if (getCategoriesQuery.data?.categories?.trees?.length) {
      return value;
    }

    return undefined;
  };

  const onCalcTreeData = () => {
    if (getCategoriesQuery.data?.categories?.trees?.length) {
      return getCategoriesQuery.data.categories.trees;
    }

    return [];
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <TreeSelect
        ref={ref}
        {...multipleSelectOption}
        loading={getCategoriesQuery.loading}
        // TIPS: waiting data then select (fix only show number)
        value={onCalcValue()}
        treeDefaultExpandAll
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={onCalcTreeData()}
        placeholder={props.placeholder || t('_lang:category')}
        onChange={onChange}
        style={props.style}
        {...props.componentProps}
      />
    </div>
  );
});
