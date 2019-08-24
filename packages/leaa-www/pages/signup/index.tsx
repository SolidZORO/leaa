import React from 'react';
import dynamic from 'next/dynamic';

import { HtmlMeta } from '@leaa/www/components/HtmlMeta';

const Signup = dynamic(() => import('@leaa/www/pages/signup/_components/Signup/Signup'));

export default () => {
  return (
    <>
      <HtmlMeta title="Sign Up" />
      <Signup />
    </>
  );
};
