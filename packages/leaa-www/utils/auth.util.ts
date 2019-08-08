import { AUTH_TOKEN_NAME, AUTH_INFO } from '@leaa/www/constants';
import { IAuthInfo, IReqCookies } from '@leaa/www/interfaces';
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
  const authInfo = localStorage.getItem(AUTH_INFO);

  const nextAuthInfo: IAuthInfo = {
    id: 0,
    email: '',
    name: '',
  };

  return authInfo
    ? {
        ...nextAuthInfo,
        ...JSON.parse(authInfo),
      }
    : nextAuthInfo;
};

//
//

const removeAuthToken = (): boolean => {
  if (!getAuthToken) {
    console.log('Not found auth token.');

    return false;
  }

  Cookies.remove(AUTH_TOKEN_NAME);

  return true;
};

const removeAuthInfo = (): boolean => {
  if (!getAuthInfo()) {
    console.log('Not found auth info.');

    return false;
  }

  localStorage.removeItem(AUTH_INFO);

  return true;
};

const removeAuth = (): boolean => {
  const removedAuthToken = removeAuthToken();
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
