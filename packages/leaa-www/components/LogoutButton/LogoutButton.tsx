import React from 'react';
import { Button } from 'antd';
import { authUtil } from '@leaa/www/utils';

export const LogoutButton = () => {
  const onLogout = () => {
    authUtil.removeAuthInfo();

    window.location.href = '/logout';
  };

  return (
    <Button type="link" onClick={onLogout}>
      Logout
    </Button>
  );
};
