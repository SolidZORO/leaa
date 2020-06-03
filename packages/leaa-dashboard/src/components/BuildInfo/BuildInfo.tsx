import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Button, message } from 'antd';

import { buildConfig } from '@leaa/dashboard/src/configs';
import { setDebugMode, isDebugMode } from '@leaa/dashboard/src/utils/debug.util';

import style from './style.module.less';

interface IProps {
  className?: string;
}

export const BuildInfo = (props: IProps) => {
  const [debugCount, setDebugCount] = useState<number>(0);

  useEffect(() => {
    if (debugCount === 7) message.loading('💪 Keep To 10!');
    if (debugCount === 10) {
      console.log('HAAAAAAAAAAAAAAAAAA!');
      setDebugMode(!isDebugMode());

      window.location.reload();
    }
  }, [debugCount]);

  const onAdd = () => setDebugCount((prevState) => prevState + 1);

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <div className={style['build-list']}>
        <div className={style['build-item']}>
          <span>MODE:</span>
          <Button type="link" size="small" className={style['switch-debug-module']} onClick={onAdd}>
            <strong>{buildConfig.MODE}</strong>
            <span className={style['switch-debug-bar']} style={{ width: debugCount * 5 }} />
          </Button>
        </div>

        <div className={style['build-item']}>
          <span>VERSION:</span>
          <strong>{buildConfig.VERSION}</strong>
        </div>

        <div className={style['build-item']}>
          <span>BUILDTIME:</span>
          <strong>{buildConfig.BUILDTIME}</strong>
        </div>
      </div>
    </div>
  );
};
