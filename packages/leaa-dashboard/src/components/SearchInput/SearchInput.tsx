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
  const [inputValue, setInputValue] = useState<string | string[]>(props.value || '');

  const onPassToParent = (e: any | 'clear') => {
    const value = e === 'clear' ? undefined : e.currentTarget.value;
    setInputValue(value);

    console.log('SearchInputKit:', value);

    if (props.onChange) {
      props.onChange(value);
    }
  };

  const onChange = (e: any) => {
    if (typeof e.button !== 'undefined' || e.currentTarget.value === '') {
      onPassToParent('clear');
    } else {
      setInputValue(e.currentTarget.value);
    }
  };

  return (
    <Input
      prefixCls="search-input ant-input"
      className={cx(style['search-input-wrapper'], 'search-input-wrapper')}
      allowClear
      onChange={onChange}
      defaultValue={inputValue}
      value={inputValue}
      addonAfter={
        <Icon
          type="search"
          className={style['search-input-search-button']}
          onClick={() =>
            onPassToParent({
              currentTarget: {
                value: inputValue,
              },
            })
          }
        />
      }
      onPressEnter={onPassToParent}
      {...props.componentProps}
    />
  );
};
