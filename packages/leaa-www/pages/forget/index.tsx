import React from 'react';
import dynamic from 'next/dynamic';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta';

const Forget = dynamic(() => import('@leaa/www/pages/forget/_components/Forget/Forget'));

export default () => {
  return (
    <>
      <HtmlMeta title="Register" />
      <Forget />
    </>
  );
};
