import React, { useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { useMutation } from '@apollo/react-hooks';
import { PureQueryOptions } from 'apollo-client';
import nookies from 'nookies';

import { LOGIN_BY_TICKET_FOR_WWW, GET_AX_BY_SLUG } from '@leaa/common/src/graphqls';
import { IGetInitialProps, IPageProps } from '@leaa/www/interfaces';
import { User } from '@leaa/common/src/entrys';
import { authUtil, urlUtil } from '@leaa/www/utils';
import { initApollo } from '@leaa/www/libs/init-apollo-client.lib';
import { HtmlMeta } from '@leaa/www/components/HtmlMeta';
import { ErrorCard } from '@leaa/www/components/ErrorCard';
import { FetchResult } from 'apollo-link';

const Login = dynamic(() => import('@leaa/www/pages/login/_components/Login/Login'));

const nextPage = ({ router }: IPageProps) => {
  // const [submitLoginMutate, submitLoginMutation] = useMutation<{
  //   loginByTicket: User;
  // }>(LOGIN_BY_TICKET_FOR_WWW, {
  //   onCompleted({ loginByTicket }) {
  //     if (loginByTicket && loginByTicket.name) {
  //       const authInfo = {
  //         id: loginByTicket.id,
  //         email: loginByTicket.email,
  //         name: loginByTicket.name,
  //       };
  //
  //       authUtil.setAuthInfo(authInfo);
  //     }
  //
  //     if (loginByTicket && loginByTicket.authToken && loginByTicket.authExpiresIn) {
  //       authUtil.setAuthToken(loginByTicket.authToken, loginByTicket.authExpiresIn);
  //     }
  //
  //     return Router.push('/account');
  //   },
  //   onError() {
  //     return submitLoginMutation.error ? <ErrorCard error={submitLoginMutation.error} /> : null;
  //   },
  // });
  //
  // useEffect(() => {
  //   if (router.query && router.query.otk) {
  //     (async () => {
  //       await submitLoginMutate({ variables: { ticket: router.query.otk } });
  //     })();
  //   }
  // }, []);

  return (
    <>
      <HtmlMeta title="Login" />
      <Login />
    </>
  );
};

// for Sign Up Redirect
nextPage.getInitialProps = async (ctx: IGetInitialProps) => {
  const otk = ctx.req && ctx.req.query && ctx.req.query.otk;
  const oid = ctx.req && ctx.req.query && ctx.req.query.oid;

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
