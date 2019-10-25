import React from 'react';
import cx from 'classnames';
import { Spin } from 'antd';

import style from './style.less';

interface IProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const PageCard = (props: IProps) => (
  <div className={cx(style['wrapper'], props.className)}>
    <Spin
      spinning={typeof props.loading !== 'undefined' ? props.loading : false}
      className={style['spin']}
      size="large"
      delay={100}
    >
      <div className={style['container']}>{props.children}</div>
    </Spin>
  </div>
);
