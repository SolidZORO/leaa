import React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/react-hooks';

import { GET_USER_BY_TOKEN_FOR_WWW } from '@leaa/common/src/graphqls';
import { IAuthInfo, IGetInitialProps } from '@leaa/www/src/interfaces';
import { authUtil, urlUtil } from '@leaa/www/src/utils';
import { HtmlMeta } from '@leaa/www/src/components/HtmlMeta';
import { ErrorCard } from '@leaa/www/src/components/ErrorCard';

const Account = dynamic(() => import('@leaa/www/src/pages/account/_components/Account/Account'));

interface IGetInitialReturnProps {
  authToken: string | undefined;
  authInfo: { name?: string; email?: string };
}

const NOT_TOKEN_REDIRECT_TO_URL = '/login';

const nextPage = (ctx: { pageProps: IGetInitialReturnProps }) => {
  const getUserByTokenQuery = useQuery<{ userByToken: IAuthInfo }, { token?: string }>(GET_USER_BY_TOKEN_FOR_WWW, {
    variables: { token: ctx.pageProps && ctx.pageProps.authToken },
  });

  return (
    <>
      {getUserByTokenQuery.error ? <ErrorCard error={getUserByTokenQuery.error} /> : null}

      {getUserByTokenQuery && getUserByTokenQuery.data && getUserByTokenQuery.data.userByToken && (
        <>
          <HtmlMeta title="Account" />
          <Account user={getUserByTokenQuery.data.userByToken} />
        </>
      )}
    </>
  );
};

nextPage.getInitialProps = async (ctx: IGetInitialProps): Promise<IGetInitialReturnProps> => {
  const authToken = authUtil.getAuthToken(ctx);
  const authInfo = authUtil.getAuthInfo(ctx);

  if (!authToken) {
    urlUtil.redirect(NOT_TOKEN_REDIRECT_TO_URL, ctx.res);
  }

  return { authToken, authInfo };
};

export default nextPage;
