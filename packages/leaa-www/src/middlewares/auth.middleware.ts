import { IRequest, IResponse, IAuthInfo } from '@leaa/www/src/interfaces';

import { GET_USER_BY_TOKEN } from '@leaa/www/src/graphqls/user.query';
import { AUTH_INFO, AUTH_TOKEN_NAME } from '@leaa/www/src/constants';
import { apolloClientWithState } from '@leaa/www/src/libs/apollo-client.lib';

export async function authMiddleware(req: IRequest, res: IResponse, next: Function) {
  const { authToken, authInfo } = req.cookies;

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

  const apolloClient = apolloClientWithState({}, authToken);

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
}
