import { AUTH_TOKEN_NAME, AUTH_INFO } from '@leaa/www/constants';
import { IAuthInfo, IReqCookies } from '@leaa/www/interfaces';
import { Response } from 'express';
import Cookies from 'js-cookie';

const isServer = typeof window === 'undefined';

const setAuthToken = (token: string, expiresIn: number) => {
  // js-cookie expires get a `day`
  Cookies.set(AUTH_TOKEN_NAME, token, { expires: expiresIn / 60 / 60 / 24 });
};

const getAuthToken = (req?: IReqCookies): string | undefined => {
  let authToken;

  if (isServer && req && req.cookies && req.cookies[AUTH_TOKEN_NAME]) {
    authToken = req.cookies[AUTH_TOKEN_NAME];
  } else {
    authToken = Cookies.get(AUTH_TOKEN_NAME);
  }

  return authToken;
};

//
//

const setAuthInfo = (info: Partial<IAuthInfo>) => {
  localStorage.setItem(AUTH_INFO, JSON.stringify(info));
};

const getAuthInfo = (): Required<IAuthInfo> => {
  let authInfo;

  if (!isServer) {
    const lsAuthInfo = localStorage.getItem(AUTH_INFO);

    const nextAuthInfo: IAuthInfo = {
      email: '',
      name: '',
    };

    authInfo = lsAuthInfo
      ? {
          ...nextAuthInfo,
          ...JSON.parse(lsAuthInfo),
        }
      : nextAuthInfo;
  }

  return authInfo;
};

//
//

const removeAuthToken = (res?: Response): boolean => {
  if (!getAuthToken) {
    console.log('Not found auth token.');

    return false;
  }

  if (isServer && res) {
    res.clearCookie(AUTH_TOKEN_NAME);
  } else {
    Cookies.get(AUTH_TOKEN_NAME);
  }

  return true;
};

const removeAuthInfo = (): boolean => {
  if (!isServer) {
    localStorage.removeItem(AUTH_INFO);

    return true;
  }

  return true;
};

const removeAuth = (res?: Response): boolean => {
  const removedAuthToken = removeAuthToken(res);
  const removedAuthInfo = removeAuthInfo();

  return removedAuthToken && removedAuthInfo;
};

//
//

const checkAuthIsAvailably = (): boolean => {
  // const authExpiresIn = localStorage.getItem(AUTH_EXPIRES_IN_NAME);
  const authToken = getAuthToken();

  if (!authToken) {
    removeAuth();

    return false;
  }

  return true;
};

export const authUtil = {
  setAuthToken,
  setAuthInfo,
  getAuthInfo,
  getAuthToken,
  removeAuthToken,
  removeAuthInfo,
  removeAuth,
  checkAuthIsAvailably,
};
