import React from 'react';
import { Avatar } from 'antd';

import avatar from '@leaa/dashboard/src/assets/images/avatar/avatar-line-w.svg';

import style from './style.module.less';

interface IProps {
  avatarUrl?: string | null;
  className?: string;
}

export const UserAvatar = (props: IProps) => {
  return <Avatar src={props.avatarUrl || avatar} alt="Avatar" shape="circle" className={style['user-avatar']} />;
};
