import React from 'react';
import cx from 'classnames';
import SignupForm from '@leaa/www/pages/signup/_components/SignupForm/SignupForm';

import style from './style.less';

export default () => {
  return (
    <div className={style['wrapper']}>
      <div className={cx('g-full-container', style['full-container'])}>
        <div className={style['signup-box']}>
          <h2 className={style['title']}>Sign Up</h2>
          <div className={style['signup-form']}>
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};
