import React from 'react';
import cx from 'classnames';

import { LogoutButton } from '@leaa/www/components/LogoutButton';

import style from './style.less';

export default () => {
  return (
    <div className={style['wrapper']}>
      <div className={cx('g-full-container', style['full-container'])}>
        <div>
          <h1>Account</h1>
          <br />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};
