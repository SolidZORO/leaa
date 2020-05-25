import cx from 'classnames';
import React from 'react';
import { Button } from 'antd';
import { ButtonSize } from 'antd/es/button';

import { envConfig } from '@leaa/dashboard/src/configs';

import style from './style.module.less';

interface IProps {
  uuid?: string;
  loading?: boolean;
  className?: string;
  showInput?: boolean;
  size?: ButtonSize;
  zanInputWidth?: number;
}

export const GithubAuthButton = (props: IProps) => {
  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Button size="small" className={style['like-button']} href={`${envConfig.API_URL}/${envConfig.API_VERSION}/auth/github/login`}>
        Auth Github
      </Button>
    </div>
  );
};
