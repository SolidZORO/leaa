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

export const SubmitBar = ({ children, title, className, loading, extra }: IProps) => (
  <div className={cx(style['page-card-wrapper'], className)}>
    <div className={style['container']}>{children}</div>
  </div>
);
