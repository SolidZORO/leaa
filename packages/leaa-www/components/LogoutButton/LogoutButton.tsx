import React from 'react';
import { Button } from 'antd';

import { authUtil } from '@leaa/www/utils';
import Router from 'next/router';

// import style from './style.less';

interface IProps {
  // error: ApolloError;
  // message?: React.ReactNode | string;
}

export const LogoutButton = (props: IProps) => {
  const onLogout = () => {
    console.log('LogoutButton');
    authUtil.removeAuth();

    return Router.push('/');
  };

  return (
    <Button type="link" onClick={onLogout}>
      Logout
    </Button>
  );
};
