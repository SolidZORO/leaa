import { Request, Response } from 'express';

import { initApollo } from '@leaa/www/libs/init-apollo-client.lib';
import { GET_USER_BY_TOKEN } from '@leaa/common/src/graphqls/user.query';
import { IAuthInfo } from '@leaa/www/interfaces';
import { authUtil } from '@leaa/www/utils';

export const authMiddleware = async (req: Request, res: Response, next: Function) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    return next();
  }

  let user;

  const apolloClient = initApollo({}, authToken);

  const removeAuth = () => {
    authUtil.removeAuth(res);
    res.writeHead(302, { Location: '/login' });
    res.end();
  };

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
