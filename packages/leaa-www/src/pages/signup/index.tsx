import React from 'react';
import dynamic from 'next/dynamic';
import { NextPageContext } from 'next';

import { PageCard } from '@leaa/www/src/components/PageCard';
import { HtmlMeta } from '@leaa/www/src/components/HtmlMeta';
import { IPageProps } from '@leaa/www/src/interfaces';

const Signup = dynamic(() => import('@leaa/www/src/pages/signup/_components/Signup/Signup'));

const nextPage = ({ router }: IPageProps) => {
  return (
    <PageCard>
      <HtmlMeta title="Sign Up" />

      <Signup urlQuery={router.query} />
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: NextPageContext) => {
  console.log(ctx.query);

  return { query: ctx.query };
};

export default nextPage;
