import React from 'react';
import dynamic from 'next/dynamic';

import { HtmlMeta } from '@leaa/www/components/HtmlMeta';
import { IPageProps } from '@leaa/www/interfaces';

const Signup = dynamic(() => import('@leaa/www/pages/signup/_components/Signup/Signup'));

export default ({ router }: IPageProps) => {
  return (
    <>
      <HtmlMeta title="Sign Up" />
      <Signup urlQuery={router.query} />
    </>
  );
};
