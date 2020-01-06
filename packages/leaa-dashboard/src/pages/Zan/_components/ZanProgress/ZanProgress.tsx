import cx from 'classnames';
import React from 'react';
import { Progress } from 'antd';
import { ProgressProps } from 'antd/lib/progress';

import { Zan } from '@leaa/common/src/entrys';

import style from './style.module.less';

interface IProps extends ProgressProps {
  item?: Zan;
  loading?: boolean;
  className?: string;
}

export const ZanProgress = (props: IProps) => {
  const percent =
    Number(((props.item?.current_zan_quantity || 0) / (props.item?.target_zan_quantity || 0)).toFixed(2)) * 100;

  return (
    <div className={cx(style['zan-progress-wrapper'], props.className)}>
      <Progress
        size={props.size}
        strokeColor={{
          '0%': '#40e101',
          '100%': '#3fc601',
        }}
        percent={percent}
      />

      <div className={style['zan-progress-quantity']}>
        {props.item?.current_zan_quantity} / {props.item?.target_zan_quantity}
      </div>
    </div>
  );
};
