import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Skeleton, Popover, Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { RiLogoutBoxRLine } from 'react-icons/ri';

import { getAuthInfo, removeAuth, formatAttaUrl } from '@leaa/dashboard/src/utils';
import { LOGOUT_REDIRECT_URL } from '@leaa/dashboard/src/constants';
import { BuildInfo, UserAvatar } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps extends RouteComponentProps {}

export const UserMenu = (props: IProps): JSX.Element => {
  const { t } = useTranslation();

  const onLogout = (): void => {
    if (removeAuth()) {
      return props.history.push(LOGOUT_REDIRECT_URL);
    }

    const messageText = t('_comp:UserMenu.logoutFaild');
    console.log(messageText);

    return undefined;
  };

  const user = getAuthInfo();

  const menuDom = (
    <div className={cx(style['usermenu-box'])}>
      <div className={style['header']}>Hi, {user.name || user.email}</div>

      <div className={style['container']}>
        <Skeleton active />

        <BuildInfo showSwitchDebug />
      </div>

      <div className={style['footer']}>
        <Button className={style['logout-button']} block type="ghost" onClick={onLogout}>
          {t('_comp:UserMenu.safelyLogout')} <RiLogoutBoxRLine className={style['safely-logout-button']} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className={cx(style['usermenu-wrapper'], 'g-usermenu-wrapper')}>
      <Popover trigger="click" placement="topRight" content={menuDom}>
        <Button type="link" className={style['usermenu-button']}>
          <UserAvatar url={formatAttaUrl(user.avatar_url)} size={40} />
          <span className={style['usermenu-name']}>{user.name}</span>
        </Button>
      </Popover>
    </div>
  );
};
