import React from 'react';
import cx from 'classnames';

import SignupForm from '@leaa/www/src/pages/signup/_components/SignupForm/SignupForm';

import style from './style.less';

export default ({ urlQuery }: { urlQuery?: { [key: string]: string | string[] } }) => {
  return (
    <div className={style['wrapper']}>
      <div className={cx('g-full-container', style['full-container'])}>
        <div className={cx('g-container-card', style['signup-box'])}>
          <h2 className={style['title']}>Sign Up</h2>
          <div className={style['signup-form']}>
            <SignupForm urlQuery={urlQuery} />
          </div>
        </div>
      </div>
    </div>
  );
};
