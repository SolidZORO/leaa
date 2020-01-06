import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Popover, Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { authUtil } from '@leaa/dashboard/src/utils';
import { LOGOUT_REDIRECT_URL } from '@leaa/dashboard/src/constants';
import { Rcon, BuildInfo, UserAvatar } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps extends RouteComponentProps {}

export const UserMenu = (props: IProps): JSX.Element => {
  const { t } = useTranslation();

  const onLogout = (): void => {
    if (authUtil.removeAuth()) {
      return props.history.push(LOGOUT_REDIRECT_URL);
    }

    const messageText = t('_comp:UserMenu.logoutFaild');
    console.log(messageText);

    return undefined;
  };

  const user = authUtil.getAuthInfo();

  const menuDom = (
    <div className={style['usermenu-box']}>
      <div className={style['header']}>Hi, {user.email}</div>

      <div className={style['container']}>
        <Skeleton active />

        <BuildInfo />
      </div>

      <div className={style['footer']}>
        <Button className={style['logout-button']} block type="ghost" onClick={onLogout}>
          {t('_comp:UserMenu.safelyLogout')}{' '}
          <Rcon type="ri-logout-box-r-line" className={style['safely-logout-button']} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className={style['usermenu-wrapper']}>
      <Popover trigger="click" placement="bottomRight" content={menuDom}>
        <Button type="link" className={style['usermenu-button']}>
          <UserAvatar avatarUrl="" />
          <span className={style['usermenu-name']}>{user.name}</span>
          <Rcon type="ri-arrow-drop-down-fill" className={style['usermenu-name-icon']} />
        </Button>
      </Popover>
    </div>
  );
};
