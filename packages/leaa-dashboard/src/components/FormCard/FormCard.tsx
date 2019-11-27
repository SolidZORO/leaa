import React from 'react';
import cx from 'classnames';
import { Card } from 'antd';

import style from './style.module.less';

interface IProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  extra?: string | React.ReactNode;
  className?: string;
}

export const FormCard = (props: IProps) => (
  <Card className={cx(style['wrapper'], props.className)}>
    <div
      className={cx(style['header'], {
        [style['header--less']]: !props.title && !props.extra,
      })}
    >
      {props.title && <div className={style['title']}>{props.title}</div>}
      {props.extra && <div className={style['extra']}>{props.extra}</div>}
    </div>
    {props.children}
  </Card>
);
