import { AUTH_TOKEN_NAME, AUTH_EXPIRES_IN_NAME, AUTH_INFO } from '@leaa/dashboard/constants';

interface IAuthInfo {
  name: string;
}

const getAuthToken = (options = { onlyToken: false }) => {
  if (!process.browser) {
    return '';
  }

  const authToken = localStorage.getItem(AUTH_TOKEN_NAME);

  if (authToken && options.onlyToken) {
    return authToken.replace(/^Bearer\s/, '');
  }

  return authToken;
};

const setAuthToken = (token: string, expiresIn: number) => {
  // sync API tims format
  const expiresInTime = `${Math.floor(Date.now() / 1000) + expiresIn}`;

  localStorage.setItem(AUTH_TOKEN_NAME, token);
  localStorage.setItem(AUTH_EXPIRES_IN_NAME, expiresInTime);
};

const setAuthInfo = (info: IAuthInfo) => {
  localStorage.setItem(AUTH_INFO, JSON.stringify(info));
};

const getAuthInfo = (): IAuthInfo => {
  const authInfo = localStorage.getItem(AUTH_INFO);

  if (authInfo) {
    return JSON.parse(authInfo);
  }

  return {
    name: '',
  };
};

const removeAuthToken = (): boolean => {
  if (!getAuthToken) {
    console.log('Not found auth token.');

    return false;
  }

  localStorage.removeItem(AUTH_TOKEN_NAME);
  localStorage.removeItem(AUTH_EXPIRES_IN_NAME);
  localStorage.removeItem(AUTH_INFO);

  return true;
};

const checkAuthIsAvailably = (): boolean => {
  const authExpiresIn = localStorage.getItem(AUTH_EXPIRES_IN_NAME);
  const authToken = getAuthToken();

  if (!authToken || !authToken || !authExpiresIn || Math.floor(Date.now() / 1000) >= Number(authExpiresIn)) {
    removeAuthToken();

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
  checkAuthIsAvailably,
};
