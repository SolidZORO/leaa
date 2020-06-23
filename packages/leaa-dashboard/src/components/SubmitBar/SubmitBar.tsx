import React from 'react';
import cx from 'classnames';

import style from './style.module.less';

interface IProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  loading?: boolean;
  full?: boolean;
}

export const SubmitBar = (props: IProps) => (
  <div
    className={cx(
      style['submit-bar-wrapper'],
      props.className,
      {
        [style['submit-bar-wrapper--full']]: props.full,
      },
      'g-submit-bar-wrapper--full',
    )}
  >
    <div className={style['submit-bar-container']}>{props.children}</div>
  </div>
);
