import React from 'react';
import cx from 'classnames';

import style from './style.module.less';

// interface IProps {
// }

export default () => {
  return (
    <div className={style['wrapper']}>
      <div className={cx('g-full-container', style['full-container'])}>NO-FORGET-NOW</div>
    </div>
  );
};
