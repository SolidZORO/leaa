import React from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import cx from 'classnames';

import style from './style.module.less';

interface IProps {
  date: string;
  size?: 'small';
  format?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const TableColumnDate = (props: IProps) => {
  const FORMAT = props.format || 'YYYY-MM-DD';

  return (
    <div
      className={cx(style['wrapper'], props.className, {
        [style['wrapper--small']]: props.size === 'small',
      })}
    >
      {props.date ? (
        <Tooltip title={moment(props.date).format('YYYY-MM-DD HH:mm:ss')} mouseEnterDelay={0.01} mouseLeaveDelay={0.01}>
          {props.prefix}
          {moment(props.date).format(FORMAT)}
          {props.suffix}
        </Tooltip>
      ) : (
        <span>N/A</span>
      )}
    </div>
  );
};
