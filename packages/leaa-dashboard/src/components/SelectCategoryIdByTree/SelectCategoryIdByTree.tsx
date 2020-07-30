import _ from 'lodash';
import cx from 'classnames';
import React, { useState, useEffect, forwardRef } from 'react';
import { TreeSelect } from 'antd';
import { useTranslation } from 'react-i18next';
import { TreeSelectProps } from 'antd/es/tree-select';
import { TreeItem } from 'react-sortable-tree';

import { envConfig } from '@leaa/dashboard/src/configs';
import { IHttpRes } from '@leaa/dashboard/src/interfaces';
import { ICategoriesQuery } from '@leaa/api/src/interfaces';
import { httpErrorMsg } from '@leaa/dashboard/src/utils';
import { useSWR } from '@leaa/dashboard/src/libs';

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

export const SelectCategoryIdByTree = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  const [value, setValue] = useState<string | string[] | undefined | null>(props.value || props.initialValues);

  const trees = useSWR<IHttpRes<TreeItem[]>>(
    {
      url: `${envConfig.API_URL}/${envConfig.API_VERSION}/categories/tree`,
      params: { expanded: true, parentSlug: props?.parentSlug } as ICategoriesQuery,
    },
    { onError: httpErrorMsg },
  );

  const onChange = (v?: string | string[] | null) => {
    setValue(v || null);

    if (props.onChange) props.onChange(v);
  };

  const multipleSelectOption = props.multipleSelect
    ? {
        treeCheckable: true,
        // showCheckedStrategy: SHOW_PARENT,
        // multiple: true,
      }
    : {};

  useEffect(() => {
    if (props.initialValues) {
      onChange(props.value || props.initialValues);
    } else {
      setValue(props.value || props.initialValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, props.initialValues]);

  return (
    <TreeSelect
      {...multipleSelectOption}
      ref={ref}
      className={cx(style['select-category-id-by-tree-comp-wrapper'], props.className)}
      size="large"
      loading={trees.loading}
      // TIPS: value 即便是有值，也必须等待 tree query 完毕后才现实，不然 select 会被 uuid 撑开
      value={!_.isEmpty(trees?.data?.data) ? value : '----'}
      treeDefaultExpandAll
      dropdownClassName={style['tree-dropdown']}
      dropdownStyle={{ width: props.dropdownWidth || 'auto' }}
      dropdownMatchSelectWidth={false}
      treeData={trees?.data?.data as any}
      placeholder={props.placeholder || t('_lang:category')}
      onChange={onChange}
      style={props.style}
      {...props.componentProps}
    />
  );
});
