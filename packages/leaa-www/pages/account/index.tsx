import React from 'react';
import Router from 'next/router';

import { IGetInitialProps } from '@leaa/www/interfaces';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta';
import Account from '@leaa/www/pages/account/_components/Account/Account';
import { authUtil } from '@leaa/www/utils';

const nxPage = () => {
  if (typeof window !== 'undefined' && !authUtil.getAuthToken()) {
    Router.push('/login').then(() => null);
  }

  return (
    <>
      <HtmlMeta title="Account" />
      <Account />
    </>
  );
};

nxPage.getInitialProps = async ({ req, res }: IGetInitialProps) => {
  if (res && !authUtil.getAuthToken(req)) {
    res.writeHead(302, { Location: '/login' });
    res.end();
  }

  return {};
};

export default nxPage;
