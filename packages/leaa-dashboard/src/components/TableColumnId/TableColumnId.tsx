import React from 'react';
import cx from 'classnames';

import style from './style.module.less';

interface IProps {
  id: string;
  className?: string;
}

export const TableColumnId = (props: IProps) => {
  return (
    <div className={cx(style['wrapper'], props.className)}>
      <code>
        <sup>#</sup>
        {props.id}
      </code>
    </div>
  );
};
