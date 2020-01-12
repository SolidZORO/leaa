import React from 'react';
import dynamic from 'next/dynamic';
import { NextPageContext } from 'next';

import { IBasePageProps } from '@leaa/www/src/interfaces';
import { PageCard, HtmlMeta } from '@leaa/www/src/components';

const Signup = dynamic(() => import('@leaa/www/src/pages/signup/_components/Signup/Signup'));

const nextPage = ({ router }: IBasePageProps) => {
  return (
    <PageCard>
      <HtmlMeta title="Sign Up" />
      <Signup urlQuery={router.query} />
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: NextPageContext) => {
  return { query: ctx.query };
};

export default nextPage;
