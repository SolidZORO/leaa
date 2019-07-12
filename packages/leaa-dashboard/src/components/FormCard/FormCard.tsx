import React from 'react';
import cx from 'classnames';
import { Card } from 'antd';

import style from './style.less';

interface IProps {
  children: React.ReactNode;
  title?: string;
  // extra?: React.ReactNode;
  className?: string;
}

export const FormCard = (props: IProps) => (
  <Card className={cx(style['wrapper'], props.className)}>
    <h3
      className={cx({
        [style['title']]: props.title,
        [style['title-less']]: !props.title,
      })}
    >
      {props.title}
    </h3>
    {props.children}
  </Card>
);
