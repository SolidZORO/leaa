import React from 'react';
import dynamic from 'next/dynamic';
import { GraphQLError } from 'graphql';

import { GET_USER_BY_TOKEN_FOR_WWW } from '@leaa/www/src/graphqls';
import { IGetInitialProps, IBasePageProps } from '@leaa/www/src/interfaces';
import { authUtil, urlUtil, messageUtil } from '@leaa/www/src/utils';
import { User } from '@leaa/common/src/entrys';
import { apolloClient } from '@leaa/www/src/libs';

import { HtmlMeta, PageCard } from '@leaa/www/src/components';

const Account = dynamic(() => import('@leaa/www/src/pages/account/_components/Account/Account'));

interface IPageProps {
  user?: User;
  userError?: GraphQLError;
}

interface IProps extends IBasePageProps<IPageProps> {}

const NOT_TOKEN_REDIRECT_TO_URL = '/login';

const nextPage = (ctx: IProps) => {
  const { user, userError } = ctx.pageProps;

  if (userError) messageUtil.gqlError(userError?.message);
  if (!user) return null;

  return (
    <PageCard>
      <HtmlMeta title="Account" disableSiteName />
      <Account user={user} />
    </PageCard>
  );
};

nextPage.getInitialProps = async (ctx: IGetInitialProps): Promise<IPageProps> => {
  const authToken = authUtil.getAuthToken(ctx);

  if (!authToken) {
    urlUtil.redirect(NOT_TOKEN_REDIRECT_TO_URL, ctx.res);
  }

  try {
    const getUserByTokenQuery = await apolloClient.query<{ userByToken: User }, { token?: string }>({
      query: GET_USER_BY_TOKEN_FOR_WWW,
      variables: { token: authToken },
    });

    return { user: getUserByTokenQuery.data.userByToken };
  } catch (err) {
    console.log(err);
    return { userError: err };
  }
};

export default nextPage;
