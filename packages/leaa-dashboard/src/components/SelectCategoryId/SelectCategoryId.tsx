import cx from 'classnames';
import React, { useState, useEffect, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { Select } from 'antd';

import { GET_CATEGORIES } from '@leaa/common/src/graphqls';
import { CategoriesWithPaginationObject, CategoriesArgs } from '@leaa/common/src/dtos/category';

import style from './style.module.less';

interface IProps {
  value?: number | undefined;
  className?: string;
  onChange?: (value: number) => void;
}

export const SelectCategoryId = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const [value, setValue] = useState<number | undefined>(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const getCategoriesVariables: CategoriesArgs = { expanded: true, listType: true };
  const getCategoriesQuery = useQuery<{ categories: CategoriesWithPaginationObject }, CategoriesArgs>(GET_CATEGORIES, {
    variables: getCategoriesVariables,
    fetchPolicy: 'network-only',
  });

  const onChange = (v: number) => {
    setValue(v);

    if (props.onChange) {
      props.onChange(v);
    }
  };

  console.log(getCategoriesQuery.data);

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Select
        defaultValue={value}
        value={value}
        ref={ref}
        placeholder={t('_lang:category')}
        onChange={onChange}
        loading={getCategoriesQuery.loading}
      >
        <Select.Option key="0" value={0}>
          ----
        </Select.Option>

        {getCategoriesQuery &&
          getCategoriesQuery.data &&
          getCategoriesQuery.data.categories &&
          getCategoriesQuery.data.categories.items &&
          getCategoriesQuery.data.categories.items.map(category => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
      </Select>
    </div>
  );
});
