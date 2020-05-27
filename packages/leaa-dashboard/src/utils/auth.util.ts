import _ from 'lodash';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { AUTH_TOKEN_NAME, AUTH_EXPIRES_IN_NAME, AUTH_INFO, GUEST_TOKEN_NAME } from '@leaa/dashboard/src/constants';
import { IAuthInfo } from '@leaa/dashboard/src/interfaces';

//
//
//
// AuthToken
export const setAuthToken = (token: string, expiresIn: number) => {
  // sync API tims format
  const expiresInTime = `${Math.floor(Date.now() / 1000) + expiresIn}`;

  localStorage.setItem(AUTH_TOKEN_NAME, token);
  localStorage.setItem(AUTH_EXPIRES_IN_NAME, expiresInTime);
};

export const getAuthToken = (options = { onlyToken: false }): string | null => {
  const authToken = localStorage.getItem(AUTH_TOKEN_NAME);

  if (!authToken) {
    console.log('Not Found Auth Token');
    return null;
  }

  if (authToken && options.onlyToken) return authToken.replace(/^Bearer\s/, '');

  return authToken;
};

export const setAuthInfo = (info: Partial<IAuthInfo>) => localStorage.setItem(AUTH_INFO, JSON.stringify(info));

export const getAuthInfo = (): Required<IAuthInfo> => {
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

export const removeAuthToken = (): boolean => {
  if (!getAuthToken) return false;

  localStorage.removeItem(AUTH_TOKEN_NAME);
  localStorage.removeItem(AUTH_EXPIRES_IN_NAME);

  return true;
};

export const removeAuthInfo = (): boolean => {
  if (!getAuthInfo()) return false;

  localStorage.removeItem(AUTH_INFO);

  return true;
};

export const removeAuth = (): boolean => {
  const removedAuthToken = removeAuthToken();
  const removedAuthInfo = removeAuthInfo();

  return removedAuthToken && removedAuthInfo;
};

export const checkAuthIsAvailably = (): boolean => {
  const authExpiresIn = localStorage.getItem(AUTH_EXPIRES_IN_NAME);
  const authToken = getAuthToken();

  if (!authToken || !authToken || !authExpiresIn || Math.floor(Date.now() / 1000) >= Number(authExpiresIn)) {
    removeAuth();

    return false;
  }

  return true;
};

//
//
//
// GusetToken
export const setGuestToken = (token: string) => localStorage.setItem(GUEST_TOKEN_NAME, token);

export const getGuestToken = (options = { onlyToken: false }): string | null => {
  const guestToken = localStorage.getItem(GUEST_TOKEN_NAME);

  if (!guestToken) {
    console.log('Not Found Guest Token');
    return null;
  }

  if (guestToken && options.onlyToken) return guestToken.replace(/^Bearer\s/, '');

  return guestToken;
};

export const removeGuestToken = (): boolean => {
  if (!getGuestToken) return false;

  localStorage.removeItem(GUEST_TOKEN_NAME);

  return true;
};

export const checkGuestIsAvailably = (): boolean => {
  return Boolean(getGuestToken());
};

//
//
//
// Tools
export const can = (permissionName: IPermissionSlug): boolean => {
  const authInfoString = localStorage.getItem(AUTH_INFO);

  if (!authInfoString || !permissionName) return false;

  let authInfo: IAuthInfo;

  try {
    authInfo = JSON.parse(authInfoString);
  } catch (e) {
    console.log(e);

    return false;
  }

  if (!authInfo) return false;
  if (!authInfo.flatPermissions || _.isEmpty(authInfo.flatPermissions)) return false;

  return authInfo.flatPermissions.includes(permissionName);
};
