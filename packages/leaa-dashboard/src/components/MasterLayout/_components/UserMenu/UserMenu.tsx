import React from 'react';
import { Skeleton, Icon, Avatar, Popover, Button } from 'antd';

import style from './style.less';

export const UserMenu = (): JSX.Element => {
  const onLogout = (): void => {
    // if (AuthUtil.removeAuthToken()) {
    //   console.log('/login');
    // }

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
