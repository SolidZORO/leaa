import cx from 'classnames';
import React, { useState, useEffect, forwardRef } from 'react';
import { TreeSelect } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { TreeSelectProps } from 'antd/lib/tree-select';

import { GET_CATEGORIES_BY_TREE } from '@leaa/common/src/graphqls';
import { CategoriesWithTreeObject } from '@leaa/common/src/dtos/category';
import { ErrorCard } from '@leaa/dashboard/src/components/ErrorCard';

import style from './style.less';

interface IProps extends TreeSelectProps<any> {
  value?: number | number[] | undefined;
  className?: string;
  onChange?: (value: number | number[]) => void;
  multipleSelect?: boolean;
}

// const { SHOW_PARENT } = TreeSelect;

export const SelectCategoryIdByTree = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const getValue = (value: number | number[] | undefined) => {
    if (typeof value === 'undefined') {
      return value;
    }

    if (!props.multipleSelect) {
      return Number(value);
    }

    return value;
  };

  console.log(props.value);

  const [value, setValue] = useState<number | number[] | undefined>(getValue(props.value));

  useEffect(() => {
    setValue(getValue(props.value));
  }, [props.value]);

  const getCategoriesByTreeQuery = useQuery<{ categoriesByTree: CategoriesWithTreeObject }>(GET_CATEGORIES_BY_TREE, {
    fetchPolicy: 'network-only',
  });

  const onChange = (v: number | number[]) => {
    const nextV = typeof v === 'number' ? Number(v) : v;

    console.log('onChange', typeof nextV, nextV);

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
    <div className={cx(style['wrapper'], props.className)}>
      {getCategoriesByTreeQuery.error ? <ErrorCard error={getCategoriesByTreeQuery.error} /> : null}

      <TreeSelect
        {...multipleSelectOption}
        loading={getCategoriesByTreeQuery.loading}
        value={value}
        size={props.size}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={
          getCategoriesByTreeQuery &&
          getCategoriesByTreeQuery.data &&
          getCategoriesByTreeQuery.data.categoriesByTree &&
          getCategoriesByTreeQuery.data.categoriesByTree.treeByStringify &&
          JSON.parse(getCategoriesByTreeQuery.data.categoriesByTree.treeByStringify)
        }
        placeholder={t('_lang:category')}
        treeDefaultExpandAll
        onChange={onChange}
      />
    </div>
  );
});
