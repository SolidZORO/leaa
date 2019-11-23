import React from 'react';
import cx from 'classnames';

import { LogoutButton } from '@leaa/www/src/components/LogoutButton';
import { IAuthInfo } from '@leaa/www/src/interfaces';

import style from './style.module.less';

interface IProps {
  user: IAuthInfo;
}

export default (props: IProps) => {
  return (
    <div className={style['wrapper']}>
      <div className={cx('g-full-container', style['full-container'])}>
        <div className={cx('g-container-card', style['account-box'])}>
          <h1 className={style['title']}>Account</h1>

          <div className={style['account-info']}>
            <h3>Name: {props.user.name}</h3>
            <h3>Email: {props.user.email}</h3>
          </div>

          <div className={style['button-bar']}>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};
