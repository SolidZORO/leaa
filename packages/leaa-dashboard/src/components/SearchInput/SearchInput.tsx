import _ from 'lodash';
import React, { useState, useCallback, useEffect } from 'react';
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

  const onSearch = useCallback(
    _.debounce((str?: string) => {
      if (props.onSearch) props.onSearch(str);
    }, 300),
    [],
  );

  const onChange = (str?: string) => {
    const nextStr = str || undefined;

    setText(nextStr);
    onSearch(nextStr);
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
          <SearchOutlined className={style['search-input-search-button']} onClick={() => onChange(text as string)} />
        }
        onPressEnter={() => onChange(text as string)}
        className={cx(style['search-input-wrapper'], 'search-input-wrapper')}
      />
    </div>
  );
};
