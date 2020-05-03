import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { AUTH_TOKEN_NAME, AUTH_EXPIRES_IN_NAME, AUTH_INFO } from '@leaa/dashboard/src/constants';
import { IAuthInfo } from '@leaa/dashboard/src/interfaces';

const setAuthToken = (token: string, expiresIn: number) => {
  // sync API tims format
  const expiresInTime = `${Math.floor(Date.now() / 1000) + expiresIn}`;

  localStorage.setItem(AUTH_TOKEN_NAME, token);
  localStorage.setItem(AUTH_EXPIRES_IN_NAME, expiresInTime);
};

const getAuthToken = (options = { onlyToken: false }): string | null => {
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
    id: '',
    email: '',
    name: '',
    avatar_url: null,
    flatPermissions: [],
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
    console.log('Not Found Auth Token');

    return false;
  }

  localStorage.removeItem(AUTH_TOKEN_NAME);
  localStorage.removeItem(AUTH_EXPIRES_IN_NAME);

  return true;
};

const removeAuthInfo = (): boolean => {
  if (!getAuthInfo()) {
    console.log('Not Found Auth Info');

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

const can = (permissionName: IPermissionSlug): boolean => {
  const authInfoString = localStorage.getItem(AUTH_INFO);

  if (!authInfoString || !permissionName) {
    return false;
  }

  let authInfo: IAuthInfo;

  try {
    authInfo = JSON.parse(authInfoString);
  } catch (e) {
    console.log(e);

    return false;
  }

  if (!authInfo) {
    return false;
  }

  if (!authInfo.flatPermissions || !Array.isArray(authInfo.flatPermissions)) {
    return false;
  }

  return authInfo.flatPermissions.includes(permissionName);
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
  can,
};
