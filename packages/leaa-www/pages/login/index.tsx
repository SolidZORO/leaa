import React, { useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { useMutation } from '@apollo/react-hooks';
import { PureQueryOptions } from 'apollo-client';

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
  const [submitLoginMutate, submitLoginMutation] = useMutation<{
    loginByTicket: User;
  }>(LOGIN_BY_TICKET_FOR_WWW, {
    onCompleted({ loginByTicket }) {
      if (loginByTicket && loginByTicket.name) {
        const authInfo = {
          id: loginByTicket.id,
          email: loginByTicket.email,
          name: loginByTicket.name,
        };

        authUtil.setAuthInfo(authInfo);
      }

      if (loginByTicket && loginByTicket.authToken && loginByTicket.authExpiresIn) {
        authUtil.setAuthToken(loginByTicket.authToken, loginByTicket.authExpiresIn);
      }

      return Router.push('/account');
    },
    onError() {
      return submitLoginMutation.error ? <ErrorCard error={submitLoginMutation.error} /> : null;
    },
  });

  useEffect(() => {
    if (router.query && router.query.otk) {
      (async () => {
        await submitLoginMutate({ variables: { ticket: router.query.otk } });
      })();
    }
  }, []);

  return (
    <>
      <HtmlMeta title="Login" />
      <Login />
    </>
  );
};

// for Sign Up Redirect
nextPage.getInitialProps = async ({ req, res }: IGetInitialProps) => {
  // if (req && req.query && req.query.otk) {
  //   const apolloClient = initApollo({});
  //
  //   await apolloClient
  //     .mutate({
  //       mutation: LOGIN_BY_TICKET_FOR_WWW,
  //       variables: { ticket: req.query && req.query.otk },
  //     })
  //     .then((response: FetchResult<{ loginByTicket: User }>) => {
  //       console.log(`login getInitialProps`, 'xxxxxxxxxxROUTER');
  //
  //       if (response.data && response.data.loginByTicket) {
  //         const { loginByTicket } = response.data;
  //
  //         console.log('login getInitialProps LOGIN_BY_TICKET_FOR_WWW / LOGINBYTICKET', loginByTicket);
  //
  //         if (loginByTicket && loginByTicket.name) {
  //           const authInfo = {
  //             id: loginByTicket.id,
  //             email: loginByTicket.email,
  //             name: loginByTicket.name,
  //           };
  //
  //           console.log('login getInitialProps LOGIN_BY_TICKET_FOR_WWW / AUTHINFO', authInfo);
  //           authUtil.setAuthInfo(authInfo);
  //         }
  //
  //         if (loginByTicket && loginByTicket.authToken && loginByTicket.authExpiresIn) {
  //           authUtil.setAuthToken(loginByTicket.authToken, loginByTicket.authExpiresIn);
  //         }
  //
  //         urlUtil.redirect(`/`, res);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('login getInitialProps LOGIN_BY_TICKET_FOR_WWW / ERROR', error);
  //     });
  // }

  if (req && req.query && req.query.oid) {
    return urlUtil.redirect(`/signup?oid=${req.query.oid}`, res);
  }

  return {};
};

export default nextPage;
