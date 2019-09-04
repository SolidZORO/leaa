import React from 'react';
import dynamic from 'next/dynamic';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta';
import { PageCard } from '@leaa/www/components/PageCard';

const Forget = dynamic(() => import('@leaa/www/pages/forget/_components/Forget/Forget'));

export default () => {
  return (
    <PageCard>
      <HtmlMeta title="Register" />

      <Forget />
    </PageCard>
  );
};
