import React from 'react';
import dynamic from 'next/dynamic';
import { NextPageContext } from 'next';

import { PageCard } from '@leaa/www/components/PageCard';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta';
import { IPageProps } from '@leaa/www/interfaces';

const Signup = dynamic(() => import('@leaa/www/pages/signup/_components/Signup/Signup'));

const nextPage = ({ router, pageProps }: IPageProps) => {
  console.log(pageProps.query);

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
