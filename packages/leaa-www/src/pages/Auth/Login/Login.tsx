import React from 'react';
import cx from 'classnames';
import { FetchResult } from 'apollo-link';
import { LOGIN_BY_TICKET_FOR_WWW } from '@leaa/www/src/graphqls';
import { IGetInitialProps } from '@leaa/www/src/interfaces';
import { User } from '@leaa/common/src/entrys';
import { authUtil, urlUtil } from '@leaa/www/src/utils';
import { PageCard, HtmlMeta } from '@leaa/www/src/components';
import { apolloClient } from '@leaa/www/src/libs';

import LoginForm from './_components/LoginForm/LoginForm';

import style from './style.module.less';

const nextPage = () => {
  return (
    <PageCard>
      <HtmlMeta title="Login" />
      <div className={style['login-wrapper']}>
        <div className={cx('g-full-container', style['full-container'])}>
          <div className={cx('g-container-card', style['login-box'])}>
            <h2 className={style['title']}>Login</h2>
            <div className={style['login-form']}>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: IGetInitialProps) => {
  const authToken = authUtil.getAuthToken(ctx);

  if (authToken) {
    urlUtil.redirect('/account', ctx.res);
  }

  const ticket = ctx.query?.ticket;

  if (ticket) {
    await apolloClient
      .mutate({
        mutation: LOGIN_BY_TICKET_FOR_WWW,
        variables: { ticket },
      })
      .then((response: FetchResult<{ loginByTicket: User }>) => {
        if (response.data?.loginByTicket) {
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

  return { ticket };
};

export default nextPage;
