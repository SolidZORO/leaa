import React from 'react';
import { Popconfirm, Button } from 'antd';
import cx from 'classnames';

import style from './style.less';

interface IProps {
  id: number;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
}

export const TableItemDeleteButton = (props: IProps) => (
  <div className={cx(style['wrapper'], props.className)}>
    <Popconfirm title={<span>Delete Item #{props.id} ?</span>} placement="topRight" onConfirm={props.onClick}>
      <Button icon="delete" size="small" loading={props.loading} />
    </Popconfirm>
  </div>
);
