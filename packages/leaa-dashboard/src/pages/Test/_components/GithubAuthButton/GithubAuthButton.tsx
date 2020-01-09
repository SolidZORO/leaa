import cx from 'classnames';
import axios from 'axios';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { ButtonSize } from 'antd/lib/button';
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
  const { t } = useTranslation();

  const oauthGithub = async () => {
    // const oauthGithubResult = await axios.get(`${envConfig.API_HOST}/auth/github/login`);

    window.open(`${envConfig.API_HOST}/auth/github/login`);

    // console.log('oauthGithubResult', oauthGithubResult);
  };

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Button size="small" className={style['like-button']} href={`${envConfig.API_HOST}/auth/github/login`}>
        Auth Github
      </Button>
    </div>
  );
};
