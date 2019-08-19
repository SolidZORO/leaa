import { AUTH_TOKEN_NAME, AUTH_EXPIRES_IN_NAME, AUTH_INFO } from '@leaa/dashboard/src/constants';
import { IAuthInfo } from '@leaa/dashboard/src/interfaces';

const setAuthToken = (token: string, expiresIn: number) => {
  // sync API tims format
  const expiresInTime = `${Math.floor(Date.now() / 1000) + expiresIn}`;

  localStorage.setItem(AUTH_TOKEN_NAME, token);
  localStorage.setItem(AUTH_EXPIRES_IN_NAME, expiresInTime);
};

const getAuthToken = (options = { onlyToken: false }): string | null => {
  if (!process.browser) {
    return null;
  }

  const authToken = localStorage.getItem(AUTH_TOKEN_NAME) || null;

  if (authToken && options.onlyToken) {
    return authToken.replace(/^Bearer\s/, '');
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
    flatePermissions: [],
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

  localStorage.removeItem(AUTH_TOKEN_NAME);
  localStorage.removeItem(AUTH_EXPIRES_IN_NAME);

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
  const authExpiresIn = localStorage.getItem(AUTH_EXPIRES_IN_NAME);
  const authToken = getAuthToken();

  if (!authToken || !authToken || !authExpiresIn || Math.floor(Date.now() / 1000) >= Number(authExpiresIn)) {
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
