import React from 'react';
import { Button } from 'antd';
import { RiArrowLeftLine } from 'react-icons/ri';

import style from './style.module.less';

const onGoToHome = () => {
  window.location.href = '/';
};

export default () => (
  <div className={style['wrapper']}>
    <div className={style['container']}>
      <div className={style['title']}>
        <Button type="primary" shape="circle" icon={<RiArrowLeftLine />} onClick={onGoToHome} />
        <strong>404 - Page Not Found</strong>
      </div>
    </div>
  </div>
);
