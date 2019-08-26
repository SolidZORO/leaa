import { AUTH_TOKEN_NAME, AUTH_INFO } from '@leaa/www/constants';
import { IAuthInfo, IReqCookies } from '@leaa/www/interfaces';
import { Response } from 'express';
import Cookies from 'js-cookie';

const isServer = typeof window === 'undefined';
const isClient = typeof window !== 'undefined';

// Tips: js-cookie expires unit is `day`, e.g. { expires: 365 * 10 } === 10 years

const setAuthToken = (token: string, expiresIn: number) => {
  Cookies.set(AUTH_TOKEN_NAME, token, { expires: expiresIn / 60 / 60 / 24 });
};

const getAuthToken = (req?: IReqCookies): string | undefined => {
  let authToken;

  if (isServer && req && req.cookies && req.cookies[AUTH_TOKEN_NAME]) {
    authToken = req.cookies[AUTH_TOKEN_NAME];
  }

  if (isClient) {
    authToken = Cookies.get(AUTH_TOKEN_NAME);
  }

  return authToken;
};

const setAuthInfo = (info: Partial<IAuthInfo>) => {
  Cookies.set(AUTH_INFO, `${JSON.stringify(info)}`, { expires: 365 * 10 });
};

const getAuthInfo = (req?: IReqCookies): Pick<IAuthInfo, 'email' | 'name'> => {
  const defaultAuthInfo: IAuthInfo = {
    email: '',
    name: '',
  };

  let authInfo: string | undefined;

  if (isServer && req && req.cookies && req.cookies[AUTH_INFO]) {
    authInfo = req.cookies[AUTH_INFO];
  }

  if (isClient) {
    authInfo = Cookies.get(AUTH_INFO);
  }

  try {
    return authInfo && JSON.parse(decodeURIComponent(authInfo));
  } catch (e) {
    return defaultAuthInfo;
  }
};

const removeAuthToken = (res?: Response): boolean => {
  if (!getAuthToken) {
    console.log('Not found auth token.');

    return false;
  }

  if (isServer && res) {
    res.clearCookie(AUTH_TOKEN_NAME);
  }

  if (isClient) {
    Cookies.get(AUTH_TOKEN_NAME);
  }

  return true;
};

const removeAuthInfo = (res?: Response): boolean => {
  if (!getAuthInfo()) {
    console.log('Not found auth info.');

    return false;
  }

  if (isServer && res) {
    res.clearCookie(AUTH_INFO);
  }

  if (isClient) {
    Cookies.remove(AUTH_INFO);
  }

  return true;
};

const removeAuth = (res?: Response): boolean => {
  const removedAuthToken = removeAuthToken(res);
  const removedAuthInfo = removeAuthInfo(res);

  return removedAuthToken && removedAuthInfo;
};

const checkAuthIsAvailably = (): boolean => {
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
