import cx from 'classnames';
import { Link } from 'react-router-dom';

import React from 'react';
import { Avatar } from 'antd';
import { AvatarProps } from 'antd/lib/avatar';

import avatar from '@leaa/dashboard/src/assets/images/avatar/avatar-line-w.svg';

import style from './style.module.less';

// @ts-ignore
interface IProps extends AvatarProps {
  url?: string | null;
  id?: number;
}

export const UserAvatar = (props: IProps) => {
  const avatarDom = (
    <Avatar
      src={props.url || avatar}
      alt="Avatar"
      shape="circle"
      {...props}
      className={cx(style['avatar'], props.className)}
    />
  );

  return props.id ? <Link to={`/users/${props.id}`}>{avatarDom}</Link> : avatarDom;
};
