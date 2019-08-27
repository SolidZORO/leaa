import { Request, Response } from 'express';

import { GET_USER_BY_TOKEN } from '@leaa/common/src/graphqls/user.query';
import { AUTH_INFO, AUTH_TOKEN_NAME } from '@leaa/www/constants';
import { IAuthInfo } from '@leaa/www/interfaces';
import { initApollo } from '@leaa/www/libs/init-apollo-client.lib';

export const authMiddleware = async (req: Request, res: Response, next: Function) => {
  const { authToken, authInfo } = req.cookies;

  console.log(authToken, authInfo);

  const removeAuth = () => {
    res.clearCookie(AUTH_INFO);
    res.clearCookie(AUTH_TOKEN_NAME);

    res.writeHead(302, { Location: '/login' });
    res.end();
  };

  // Avoid Hack
  if ((authInfo && !authToken) || (!authInfo && authToken)) {
    removeAuth();
  }

  if (!authToken) {
    return next();
  }

  let user;

  const apolloClient = initApollo({}, authToken);

  try {
    user = await apolloClient.query<{ userByToken: IAuthInfo }, { token: string }>({
      query: GET_USER_BY_TOKEN,
      variables: { token: authToken },
    });

    if (!user || !user.data || !user.data.userByToken || !user.data.userByToken.email) {
      console.log('AUTHMIDDLEWARE-TRY-CATCH-NOT-USER');

      removeAuth();

      return next();
    }
  } catch (e) {
    console.log('AUTHMIDDLEWARE-TRY-CATCH-ERROR', e);

    removeAuth();

    return next();
  }

  return next();
};
