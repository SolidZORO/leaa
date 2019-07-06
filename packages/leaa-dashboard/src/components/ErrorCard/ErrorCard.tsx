import React, { useEffect } from 'react';
import { Card, notification } from 'antd';

import style from './style.less';

interface IProps {
  message: React.ReactNode;
}

export const ErrorCard = ({ message }: IProps) => {
  useEffect(() => {
    notification.error({
      message,
    });
  }, []);

  return (
    <div className={style['wrapper']}>
      <Card>
        <div className={style['container']}>{message}</div>
      </Card>
    </div>
  );
};
