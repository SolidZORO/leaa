import cx from 'classnames';
import React from 'react';
import { GraphQLError } from 'graphql';

import { GET_USER_BY_TOKEN_FOR_WWW } from '@leaa/www/src/graphqls';
import { IGetInitialPropsCtx, IBasePageProps } from '@leaa/www/src/interfaces';
import { authUtil, urlUtil, messageUtil } from '@leaa/www/src/utils';
import { User } from '@leaa/common/src/entrys';
import { apolloClient } from '@leaa/www/src/libs';

import { HtmlMeta, PageCard, LogoutButton, UserAvatar } from '@leaa/www/src/components';

import style from './style.module.less';

interface IPageProps {
  user?: User;
  userError?: GraphQLError;
}

interface IProps extends IBasePageProps<IPageProps> {}

const NOT_TOKEN_REDIRECT_TO_URL = '/login';

const nextPage = (props: IProps) => {
  const { user, userError } = props.pageProps;

  if (userError) messageUtil.gqlError(userError?.message);
  if (!user) return null;

  return (
    <PageCard>
      <HtmlMeta title="Account" disableSiteName />
      <div className={style['wrapper']}>
        <div className={cx('g-full-container', style['full-container'])}>
          <div className={cx('g-container-card', style['account-box'])}>
            <h1 className={style['title']}>Account</h1>

            <div className={style['account-info']}>
              <UserAvatar url={user?.avatar_url} size={48} className={style['avatar']} />

              <h3>Name: {user.name}</h3>
              <h3>Email: {user.email}</h3>
            </div>

            <div className={style['button-bar']}>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: IGetInitialPropsCtx): Promise<IPageProps> => {
  if (!authUtil.checkAuthIsAvailably(ctx)) {
    urlUtil.redirect(NOT_TOKEN_REDIRECT_TO_URL, ctx.res);

    return { user: undefined };
  }

  const authToken = authUtil.getAuthToken(ctx);

  if (!authToken) return { user: undefined };

  try {
    const getUserByTokenQuery = await apolloClient.query<{ userByToken: User }, { token?: string }>({
      query: GET_USER_BY_TOKEN_FOR_WWW,
      variables: { token: authToken },
    });

    return { user: getUserByTokenQuery.data.userByToken };
  } catch (err) {
    return { userError: err };
  }
};

export default nextPage;
