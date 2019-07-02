import React, { useState } from 'react';
import cx from 'classnames';
import { Input, Icon } from 'antd';
import { InputProps } from 'antd/lib/input';

import style from './style.less';

interface IProps {
  onChange?: Function;
  value?: string | string[];
  componentProps?: InputProps;
}

export const SearchInput = (props: IProps) => {
  const [searchText, setSearchText] = useState<string | string[] | undefined>(props.value || undefined);

  const onPassToParent = (text: string | string[] | undefined) => {
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
    <Input
      prefixCls="search-input ant-input"
      className={cx(style['search-input-wrapper'], 'search-input-wrapper')}
      allowClear
      onChange={onChange}
      defaultValue={searchText}
      value={searchText}
      addonAfter={
        <Icon
          type="search"
          className={style['search-input-search-button']}
          onClick={() => onPassToParent(searchText)}
        />
      }
      onPressEnter={() => onPassToParent(searchText)}
      {...props.componentProps}
    />
  );
};
