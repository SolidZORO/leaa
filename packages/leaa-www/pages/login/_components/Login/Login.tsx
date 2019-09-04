import React from 'react';
import cx from 'classnames';

import LoginForm from '@leaa/www/pages/login/_components/LoginForm/LoginForm';

import style from './style.less';

export default () => {
  return (
    <div className={style['wrapper']}>
      <div className={cx('g-full-container', style['full-container'])}>
        <div className={style['login-box']}>
          <h2 className={style['title']}>Login</h2>
          <div className={style['login-form']}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};
