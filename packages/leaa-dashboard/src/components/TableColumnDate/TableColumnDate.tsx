import React from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import cx from 'classnames';

import { FORMAT_DATA, FORMAT_DATA_TIME } from '@leaa/dashboard/src/constants';

import style from './style.module.less';

interface IProps {
  date?: Date | string;
  size?: 'small';
  format?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const TableColumnDate = (props: IProps) => {
  return (
    <div
      className={cx(style['wrapper'], props.className, {
        [style['wrapper--small']]: props.size === 'small',
      })}
    >
      {props.date ? (
        <Tooltip title={moment(props.date).format(FORMAT_DATA_TIME)}>
          {props.prefix}
          {moment(props.date).format(props.format || FORMAT_DATA)}
          {props.suffix}
        </Tooltip>
      ) : (
        <span>N/A</span>
      )}
    </div>
  );
};
