import React from 'react';
import dynamic from 'next/dynamic';

import { HtmlMeta } from '@leaa/www/components/HtmlMeta';

const Register = dynamic(() => import('@leaa/www/pages/register/_components/Register/Register'));

export default () => {
  return (
    <>
      <HtmlMeta title="Register" />
      <Register />
    </>
  );
};
