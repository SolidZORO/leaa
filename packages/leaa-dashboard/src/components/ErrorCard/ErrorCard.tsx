import React, { useEffect } from 'react';
import { notification } from 'antd';
import { errorMsg } from '@leaa/dashboard/src/utils';

import style from './style.module.less';

interface IProps {
  error: Error;
  message?: React.ReactNode | string;
}

export const ErrorCard = (props: IProps) => {
  let message: string | null = null;

  if (props.error) {
    ({ message } = props.error);
  }

  if (props.message) {
    message = typeof props.message === 'string' ? props.message : JSON.stringify(props.message);
  }

  useEffect(() => {
    if (message) {
      // @ts-ignore
      notification.error({ message: errorMsg(message), className: style['container'] });
    }
  }, [message]);

  return null;
};
