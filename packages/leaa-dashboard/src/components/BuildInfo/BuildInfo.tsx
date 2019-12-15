import React from 'react';
import cx from 'classnames';

import { buildConfig } from '@leaa/dashboard/src/configs';

import style from './style.module.less';

interface IProps {
  className?: string;
}

export const BuildInfo = (props: IProps) => {
  return (
    <div className={cx(style['wrapper'], props.className)}>
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
  );
};
