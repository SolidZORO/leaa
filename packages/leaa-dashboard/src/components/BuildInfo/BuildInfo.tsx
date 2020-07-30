import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Button } from 'antd';

import { buildConfig } from '@leaa/dashboard/src/configs';
import { setDebugMode, isDebugMode } from '@leaa/dashboard/src/utils/debug.util';

import style from './style.module.less';

interface IProps {
  className?: string;
  showSwitchDebug?: boolean;
}

export const BuildInfo = (props: IProps) => {
  const [debugCount, setDebugCount] = useState<number>(0);

  useEffect(() => {
    if (debugCount === 5) {
      console.log('HAAAAAAAAAAAAAAAAAA!');
      setDebugMode(!isDebugMode());

      window.location.reload();
    }
  }, [debugCount]);

  const onAdd = () => setDebugCount((prevState) => prevState + 1);

  return (
    <div className={cx(style['build-info-comp-wrapper'], props.className)}>
      <div className={style['build-list']}>
        <div className={style['build-item']}>
          <span>MODE:</span>
          {props.showSwitchDebug ? (
            <Button type="link" size="small" className={style['switch-debug-module']} onClick={onAdd}>
              <strong>{buildConfig.MODE}</strong>
              <span className={style['switch-debug-bar']} style={{ width: debugCount * 10 }} />
            </Button>
          ) : (
            <strong>{buildConfig.MODE}</strong>
          )}
        </div>

        <div className={style['build-item']}>
          <span>VERSION:</span>
          <strong>
            {buildConfig.VERSION} ({buildConfig.GIT_VERSION})
          </strong>
        </div>

        <div className={style['build-item']}>
          <span>BUILDTIME:</span>
          <strong>{buildConfig.BUILDTIME}</strong>
        </div>
      </div>
    </div>
  );
};
