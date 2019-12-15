import React from 'react';
import dynamic from 'next/dynamic';
import { HtmlMeta, PageCard } from '@leaa/www/src/components';

const Forget = dynamic(() => import('@leaa/www/src/pages/forget/_components/Forget/Forget'));

export default () => {
  return (
    <PageCard>
      <HtmlMeta title="Register" />

      <Forget />
    </PageCard>
  );
};
