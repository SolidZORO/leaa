import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Avatar, Popover, Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { authUtil } from '@leaa/dashboard/src/utils';
import { buildConfig } from '@leaa/dashboard/src/configs';
import { Rcon } from '@leaa/dashboard/src/components';
import { LOGOUT_REDIRECT_URL } from '@leaa/dashboard/src/constants';

import avatar from '@leaa/dashboard/src/assets/images/avatar/avatar-line.svg';
import style from './style.module.less';

interface IProps extends RouteComponentProps {}

export const UserMenu = (props: IProps): JSX.Element => {
  const { t } = useTranslation();

  const onLogout = (): void => {
    if (authUtil.removeAuth()) {
      return props.history.push(LOGOUT_REDIRECT_URL);
    }

    const messageText = t('_comp:UserMenu.logoutFaild');

    return console.log(messageText);
  };

  const user = authUtil.getAuthInfo();

  const menuDom = (
    <div className={style['usermenu-box']}>
      <div className={style['header']}>Hi, {user.email}</div>

      <div className={style['container']}>
        <Skeleton active />

        <div className={style['build-list']}>
          <div className={style['build-item']}>
            <span>MODE:</span>
            <strong>{buildConfig.MODE}</strong>
          </div>

          <div className={style['build-item']}>
            <span>VERSION:</span>
            <strong>{buildConfig.VERSION}</strong>
          </div>

          <div className={style['build-item']}>
            <span>TIMESTAMP:</span>
            <strong>{buildConfig.TIMESTAMP}</strong>
          </div>
        </div>
      </div>

      <div className={style['footer']}>
        <Button className={style['logout-button']} block type="ghost" onClick={onLogout}>
          <Rcon type="ri-logout-box-r-line" /> {t('_comp:UserMenu.safelyLogout')}
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
