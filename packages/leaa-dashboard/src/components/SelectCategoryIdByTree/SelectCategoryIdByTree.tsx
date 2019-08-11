import React, { useState, useEffect, forwardRef } from 'react';
import { TreeSelect } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';

import { GET_CATEGORIES_BY_TREE } from '@leaa/common/graphqls';
import { CategoriesWithTreeObject } from '@leaa/common/dtos/category';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import cx from 'classnames';

import style from './style.less';

interface IProps {
  value?: number | undefined;
  className?: string;
  onChange?: (value: number) => void;
}

export const SelectCategoryIdByTree = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const [value, setValue] = useState<number | undefined>(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const getCategoriesByTreeQuery = useQuery<{ categoriesByTree: CategoriesWithTreeObject }>(GET_CATEGORIES_BY_TREE, {
    fetchPolicy: 'network-only',
  });

  const onChange = (v: number) => {
    setValue(Number(v));

    if (props.onChange) {
      props.onChange(Number(v));
    }
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      {getCategoriesByTreeQuery.error ? <ErrorCard error={getCategoriesByTreeQuery.error} /> : null}

      <TreeSelect
        loading={getCategoriesByTreeQuery.loading}
        value={value}
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
