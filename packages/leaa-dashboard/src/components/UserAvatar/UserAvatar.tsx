import cx from 'classnames';
import { Link } from 'react-router-dom';

import React from 'react';
import { Avatar } from 'antd';
import { AvatarProps } from 'antd/es/avatar';

import { formatAttaUrl } from '@leaa/dashboard/src/utils';
import defaultAvatar from '@leaa/dashboard/src/assets/images/default-avatar.svg';

import style from './style.module.less';

// @ts-ignore
interface IProps extends AvatarProps {
  url?: string | null;
  id?: string;
  border?: number;
}

export const UserAvatar = (props: IProps) => {
  const avatarDom = (
    <Avatar
      src={formatAttaUrl(props.url, { defaultImage: defaultAvatar })}
      alt="Avatar"
      shape="circle"
      {...props}
      className={cx(style['avatar'], props.className)}
      style={{ borderWidth: props.border || 0 }}
    />
  );

  return props.id ? <Link to={`/users/${props.id}`}>{avatarDom}</Link> : avatarDom;
};
