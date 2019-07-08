import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Icon, Avatar, Popover, Button, message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { authUtil } from '@leaa/dashboard/utils';
import { LOGOUT_REDIRECT_URL } from '@leaa/dashboard/constants';
import avatar from '@leaa/dashboard/assets/images/avatar/avatar-cli.svg';

import style from './style.less';

interface IProps extends RouteComponentProps {}

export const UserMenu = (props: IProps): JSX.Element => {
  const { t } = useTranslation();

  const onLogout = (): void => {
    if (authUtil.removeAuthToken()) {
      return props.history.push(LOGOUT_REDIRECT_URL);
    }

    const messageText = 'Logout Failed.';
    message.error(messageText);

    return console.log(messageText);
  };

  const menuDom = (
    <div className={style['usermenu-box']}>
      <div className={style['header']}>Hi, {authUtil.getAuthInfo().name}</div>

      <div className={style['container']}>
        <Skeleton active />
      </div>

      <div className={style['footer']}>
        <Button className={style['logout-button']} block type="ghost" onClick={onLogout}>
          <Icon type="poweroff" /> {t(`_comp:UserMenu.safelyLogout`)}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={style['usermenu-wrapper']}>
      <Popover trigger="click" placement="bottomRight" content={menuDom}>
        <Button type="ghost" shape="circle" className={style['usermenu-button']}>
          <Avatar src={avatar} alt="Avatar" shape="circle" className={style['usermenu-avatar']} />
        </Button>
      </Popover>
    </div>
  );
};
