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
      fetchPolicy: 'network-only',
    },
  );

  const getValue = (value: number | number[] | undefined) => {
    if (typeof value === 'undefined') {
      return value;
    }

    if (!props.multipleSelect) {
      console.log(typeof value);

      return Number(value);
    }

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

  return (
    <div className={cx(style['wrapper'])}>
      <TreeSelect
        ref={ref}
        {...multipleSelectOption}
        className={props.className}
        loading={getCategoriesQuery.loading}
        value={value}
        treeDefaultExpandAll
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={
          getCategoriesQuery &&
          getCategoriesQuery.data &&
          getCategoriesQuery.data.categories &&
          getCategoriesQuery.data.categories.trees
        }
        placeholder={t('_lang:category')}
        onChange={onChange}
        style={props.style}
        {...props.componentProps}
      />
    </div>
  );
});
