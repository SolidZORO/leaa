import React from 'react';
import { Skeleton, Icon, Avatar, Popover, Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { authUtil } from '@leaa/dashboard/utils';
import { LOGOUT_REDIRECT_URL } from '@leaa/dashboard/constants';

import style from './style.less';

interface IProps extends RouteComponentProps {}

export const UserMenu = (props: IProps): JSX.Element => {
  const onLogout = (): void => {
    if (authUtil.removeAuthToken()) {
      props.history.push(LOGOUT_REDIRECT_URL);
    }

    return console.log('onLogout failed.');
  };

  const menuDom = (
    <div className={style['usermenu-box']}>
      <div className={style.header}>Welcome!</div>

      <div className={style.container}>
        <Skeleton active />
      </div>

      <div className={style.footer}>
        <Button className={style['logout-button']} block type="ghost" onClick={onLogout}>
          <Icon type="poweroff" /> Success Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className={style['usermenu-wrapper']}>
      <Popover trigger="click" placement="bottomRight" content={menuDom}>
        <Button className={style['usermenu-button']} type="ghost" shape="circle">
          <Avatar src="" alt="Avatar" shape="circle" />
        </Button>
      </Popover>
    </div>
  );
};
