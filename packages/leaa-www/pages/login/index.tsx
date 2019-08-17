import React from 'react';
import dynamic from 'next/dynamic';

import { HtmlMeta } from '@leaa/www/components/HtmlMeta';

const Login = dynamic(() => import('@leaa/www/pages/login/_components/Login/Login'));

export default () => {
  return (
    <>
      <HtmlMeta title="Login" />
      <Login />
    </>
  );
};
