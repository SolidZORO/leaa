import React, { useEffect } from 'react';
// import { Card, notification } from 'antd';
import { notification } from 'antd';

import style from './style.less';

interface IProps {
  message: React.ReactNode;
}

export const ErrorCard = (props: IProps) => {
  const message = typeof props.message === 'string' ? props.message : JSON.stringify(props.message);

  useEffect(() => {
    if (message) {
      notification.error({ message, className: style['container'] });
    }
  }, [message]);

  return null;

  // return (
  //   <div className={style['wrapper']}>
  //     <Card>
  //       <div className={style['container']}>{props.message}</div>
  //     </Card>
  //   </div>
  // );
};
