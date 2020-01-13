import cx from 'classnames';

import React from 'react';
import { Avatar } from 'antd';
import { AvatarProps } from 'antd/lib/avatar';

import style from './style.module.less';

// @ts-ignore
interface IProps extends AvatarProps {
  url?: string | null;
  id?: number;
}

export const UserAvatar = (props: IProps) => {
  return (
    <Avatar
      src={props.url || '/static/images/avatar/avatar-line.png'}
      alt="Avatar"
      shape="circle"
      {...props}
      className={cx(style['avatar'], props.className)}
    />
  );
};
