import { NextPageContext } from 'next';
import { AUTH_TOKEN_NAME, AUTH_INFO } from '@leaa/www/constants';
import { IAuthInfo } from '@leaa/www/interfaces';
import Cookies from 'js-cookie';
import nookies from 'nookies';

const isServer = typeof window === 'undefined';
const isClient = typeof window !== 'undefined';

// Tips: js-cookie expires unit is `day`, e.g. { expires: 365 * 10 } === 10 years

const setAuthToken = (token: string, expiresIn: number, ctx?: NextPageContext) => {
  const expires = expiresIn / 60 / 60 / 24;

  if (isServer) {
    nookies.set(ctx, AUTH_TOKEN_NAME, token, { maxAge: expires });
  }

  if (isClient) {
    Cookies.set(AUTH_TOKEN_NAME, token, { expires });
  }
};

const getAuthToken = (ctx?: NextPageContext): string | undefined => {
  let authToken;

  if (isServer) {
    authToken = nookies.get(ctx)[AUTH_TOKEN_NAME];
  }

  if (isClient) {
    authToken = Cookies.get(AUTH_TOKEN_NAME);
  }

  return authToken;
};

const setAuthInfo = (info: Partial<IAuthInfo>, ctx?: NextPageContext) => {
  const expires = 365 * 10;
  const authInfo = `${JSON.stringify(info)}`;

  if (isServer) {
    nookies.set(ctx, AUTH_INFO, authInfo, { maxAge: expires });
  }

  if (isClient) {
    Cookies.set(AUTH_INFO, authInfo, { expires });
  }
};

const getAuthInfo = (ctx?: NextPageContext): Pick<IAuthInfo, 'email' | 'name'> => {
  const defaultAuthInfo: IAuthInfo = {
    email: '',
    name: '',
  };

  let authInfo: string | undefined;

  if (isServer) {
    authInfo = nookies.get(ctx)[AUTH_INFO];
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

const removeAuthToken = (ctx?: NextPageContext): boolean => {
  if (!getAuthToken) {
    console.log('Not found auth token.');

    return false;
  }

  if (isServer) {
    nookies.destroy(ctx, AUTH_TOKEN_NAME);
  }

  if (isClient) {
    Cookies.remove(AUTH_TOKEN_NAME);
  }

  return true;
};

const removeAuthInfo = (ctx?: NextPageContext): boolean => {
  if (!getAuthInfo()) {
    console.log('Not found auth info.');

    return false;
  }

  if (isServer) {
    nookies.destroy(ctx, AUTH_INFO);
  }

  if (isClient) {
    Cookies.remove(AUTH_INFO);
  }

  return true;
};

const removeAuth = (ctx?: NextPageContext): boolean => {
  const removedAuthToken = removeAuthToken(ctx);
  const removedAuthInfo = removeAuthInfo(ctx);

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
