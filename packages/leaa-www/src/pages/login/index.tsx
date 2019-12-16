import React from 'react';
import dynamic from 'next/dynamic';
import { FetchResult } from 'apollo-link';
// import { ApolloClient } from 'apollo-client';

import { LOGIN_BY_TICKET_FOR_WWW } from '@leaa/common/src/graphqls';
import { IGetInitialProps } from '@leaa/www/src/interfaces';
import { User } from '@leaa/common/src/entrys';
import { authUtil, urlUtil } from '@leaa/www/src/utils';
import { PageCard, HtmlMeta } from '@leaa/www/src/components';
import { apolloClient } from '@leaa/www/src/libs';

const Login = dynamic(() => import('@leaa/www/src/pages/login/_components/Login/Login'));

const nextPage = () => {
  return (
    <PageCard>
      <HtmlMeta title="登录" />
      <Login />
    </PageCard>
  );
};

// for Sign Up Redirect
nextPage.getInitialProps = async (ctx: IGetInitialProps) => {
  const otk = ctx.query && ctx.query.otk;
  const oid = ctx.query && ctx.query.oid;

  if (otk) {
    // const apolloClient = apolloClient({});

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

          urlUtil.redirect('/account', ctx.res);
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
