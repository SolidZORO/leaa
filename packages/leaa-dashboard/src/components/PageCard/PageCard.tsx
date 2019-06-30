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

export const PageCard = ({ children, title, className, loading, extra }: IProps) => (
  <div className={cx(style['page-card-wrapper'], className)}>
    <Spin spinning={loading}>
      <div className={style['header']}>
        {title && <div className={style['title']}>{title}</div>}

        {extra && <div className={style['extra']}>{extra}</div>}
      </div>

      <div className={style['container']}>{children}</div>
    </Spin>
  </div>
);
