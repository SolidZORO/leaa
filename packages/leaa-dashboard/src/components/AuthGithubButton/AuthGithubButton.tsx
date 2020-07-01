import cx from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { ButtonSize } from 'antd/es/button';
import { envConfig } from '@leaa/dashboard/src/configs';

import style from './style.module.less';

interface IProps {
  loading?: boolean;
  className?: string;
  size?: ButtonSize;
}

export const AuthGithubButton = (props: IProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx(style['auth-github-button-wrapper'], props.className)}>
      <Button size="small" href={`${envConfig.API_URL}/${envConfig.API_VERSION}/auth/github/login`}>
        Github
      </Button>
    </div>
  );
};
