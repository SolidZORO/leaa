import React from 'react';
import { Button } from 'antd';

import style from './style.module.less';

const onGoToHome = () => {
  window.location.href = '/';
};

export default () => (
  <div className={style['wrapper']}>
    <div className={style['container']}>
      <div className={style['title']}>
        <Button type="primary" shape="circle" icon="disconnect" onClick={onGoToHome} />
        <strong>Page Not Found</strong>
      </div>
    </div>
  </div>
);
