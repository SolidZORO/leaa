import React, { useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import { InputProps } from 'antd/es/input';
import { SearchOutlined } from '@ant-design/icons';

import style from './style.module.less';

interface IProps {
  onChange?: (str?: string) => void;
  value?: string | string[];
  componentProps?: InputProps;
  className?: string;
}

export const SearchInput = (props: IProps) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState<string | string[] | undefined>(props.value || undefined);

  const onPassToParent = (text?: string) => {
    const nextText = text === '__CLEAR__' ? undefined : text;

    setSearchText(nextText);

    if (props.onChange) {
      props.onChange(nextText);
    }
  };

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (!event.currentTarget.value) {
      onPassToParent('__CLEAR__');
    } else {
      setSearchText(event.currentTarget.value);
    }
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Input
        prefixCls="search-input ant-input"
        className={cx(style['search-input-wrapper'], 'search-input-wrapper')}
        allowClear
        placeholder={`${t('_comp:SearchInput.placeholder')}`}
        onChange={onChange}
        defaultValue={searchText}
        value={searchText}
        addonAfter={
          <SearchOutlined
            className={style['search-input-search-button']}
            onClick={() => onPassToParent(searchText as string)}
          />
        }
        onPressEnter={() => onPassToParent(searchText as string)}
        {...props.componentProps}
      />
    </div>
  );
};
