import React from 'react';
// import dynamic from 'next/dynamic';
import { FetchResult } from 'apollo-link';

import { LOGIN_BY_TICKET_FOR_WWW } from '@leaa/common/src/graphqls';
import { IGetInitialProps } from '@leaa/www/interfaces';
import { User } from '@leaa/common/src/entrys';
import { authUtil, urlUtil } from '@leaa/www/utils';
import { initApollo } from '@leaa/www/libs/init-apollo-client.lib';
import { PageCard } from '@leaa/www/components/PageCard';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta';

import Login from '@leaa/www/pages/login/_components/Login/Login';
// const Login = dynamic(() => import('@leaa/www/pages/login/_components/Login/Login'));

const nextPage = () => {
  return (
    <PageCard>
      <HtmlMeta title="Login" />

      <Login />
    </PageCard>
  );
};

// for Sign Up Redirect
nextPage.getInitialProps = async (ctx: IGetInitialProps) => {
  const otk = ctx.query && ctx.query.otk;
  const oid = ctx.query && ctx.query.oid;

  if (otk) {
    const apolloClient = initApollo({});

    await apolloClient
      .mutate({
        mutation: LOGIN_BY_TICKET_FOR_WWW,
        variables: { ticket: otk },
      })
      .then((response: FetchResult<{ loginByTicket: User }>) => {
        if (response.data && response.data.loginByTicket) {
          const { loginByTicket } = response.data;

          if (loginByTicket && loginByTicket.name) {
            const authInfo = {
              id: loginByTicket.id,
              email: loginByTicket.email,
              name: loginByTicket.name,
            };

            authUtil.setAuthInfo(authInfo, ctx);
          }

          if (loginByTicket && loginByTicket.authToken && loginByTicket.authExpiresIn) {
            authUtil.setAuthToken(loginByTicket.authToken, loginByTicket.authExpiresIn, ctx);
          }

          urlUtil.redirect(`/account`, ctx.res);
        }
      })
      .catch(error => {
        console.error('login getInitialProps LOGIN_BY_TICKET_FOR_WWW / ERROR', error);

        urlUtil.redirect('/', ctx.res);
      });
  }

  if (oid) {
    return urlUtil.redirect(`/signup?oid=${oid}`, ctx.res);
  }

  return { oid, otk };
};

export default nextPage;
