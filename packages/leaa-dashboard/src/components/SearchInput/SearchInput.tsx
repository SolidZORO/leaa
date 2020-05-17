import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import { InputProps } from 'antd/es/input';
import { SearchOutlined } from '@ant-design/icons';

import style from './style.module.less';

interface IProps extends InputProps {
  onSearch?: (s?: string) => void;
  className?: string;
}

export const SearchInput = (props: IProps) => {
  const { t } = useTranslation();
  const [text, setText] = useState<string | number | string[] | undefined>(props.value);

  const onChange = (str?: string) => {
    const nextStr = str || undefined;
    if (typeof nextStr === 'undefined' && props.onSearch) props.onSearch(nextStr);

    setText(nextStr);
  };

  const onSearch = (str?: string) => {
    const nextStr = str || undefined;

    if (props.onSearch) props.onSearch(nextStr);
  };

  useEffect(() => {
    if (!props.value) setText(undefined);
  }, [props.value]);

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Input
        prefixCls="search-input ant-input"
        allowClear
        placeholder={`${t('_comp:SearchInput.placeholder')}`}
        onChange={(e) => onChange(e.currentTarget.value)}
        value={text}
        addonAfter={
          <SearchOutlined className={style['search-input-search-button']} onClick={() => onSearch(text as string)} />
        }
        onPressEnter={() => onSearch(text as string)}
        className={cx(style['search-input-wrapper'], 'search-input-wrapper')}
      />
    </div>
  );
};
