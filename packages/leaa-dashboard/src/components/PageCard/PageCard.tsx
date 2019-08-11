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
    <div className={style['header']}>
      {props.title && <div className={style['title']}>{props.title}</div>}

      {props.extra && <div className={style['extra']}>{props.extra}</div>}
    </div>

    <Spin spinning={props.loading} className={style['spin']}>
      <div className={style['container']}>{props.children}</div>
    </Spin>
  </div>
);
