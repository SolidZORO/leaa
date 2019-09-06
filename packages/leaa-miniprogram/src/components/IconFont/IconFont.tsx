import cx from 'classnames';
import React from 'react';
import Taro from '@tarojs/taro';
import { Text } from '@tarojs/components';

import '@leaa/miniprogram/src/assets/fonts/fi/iconfont.global.less';

interface IProps {
  type?: string;
  className?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const IconFont = (props: IProps) => {
  return (
    <Text
      className={cx('fi', `anticon-${props.type}`, props.className)}
      style={{
        ...props.style,
        fontSize: `${props.size}px`,
        color: props.color,
      }}
    />
  );
};
