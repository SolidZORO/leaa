import React from 'react';
import cx from 'classnames';

import style from './style.less';

// interface IProps {
// }

export default () => {
  return (
    <div className={style['wrapper']}>
      <div className={cx('g-full-container', style['full-container'])}>NO-REGISTER-NOW</div>
    </div>
  );
};
