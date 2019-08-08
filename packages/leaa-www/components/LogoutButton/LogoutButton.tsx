import React from 'react';
import { Button } from 'antd';
import { authUtil } from '@leaa/www/utils';

// import style from './style.less';

interface IProps {
  // error: ApolloError;
  // message?: React.ReactNode | string;
}

export const LogoutButton = (props: IProps) => {
  const onLogout = () => {
    console.log('LogoutButton');
    authUtil.removeAuth();
  };

  return (
    <Button type="link" onClick={onLogout}>
      Logout
    </Button>
  );
};
