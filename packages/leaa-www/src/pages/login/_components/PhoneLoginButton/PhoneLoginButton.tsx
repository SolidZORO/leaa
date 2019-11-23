import cx from 'classnames';
import React, { useState } from 'react';
import { Button, message } from 'antd';

import style from './style.module.less';

export default () => {
  const [type, setType] = useState<string>('mobile');

  const onSubmitWechat = async () => {
    message.success('Coming Soon');
    setType(type !== 'mail' ? 'mail' : 'mobile');
  };

  return (
    <div className={style['wrapper']}>
      <Button
        type="primary"
        shape="circle"
        className={cx({
          [style['mobile-login-button']]: type === 'mobile',
          [style['mail-login-button']]: type === 'mail',
        })}
        onClick={onSubmitWechat}
        icon={type}
      />
    </div>
  );
};
