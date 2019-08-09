import React from 'react';
import { Button } from 'antd';

export const LogoutButton = () => {
  const onLogout = () => {
    window.location.href = '/logout';
  };

  return (
    <Button type="link" onClick={onLogout}>
      Logout
    </Button>
  );
};
