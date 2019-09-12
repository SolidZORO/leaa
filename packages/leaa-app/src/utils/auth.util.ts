import { AsyncStorage } from 'react-native';

import { IAuthInfo, IAuthBaseInfo } from '@leaa/app/src/interfaces';
import { AUTH_TOKEN_NAME, AUTH_INFO, AUTH_EXPIRES_IN_NAME } from '@leaa/app/src/constants';

const setAuthToken = async (token: string, expiresIn: number) => {
  const expiresInTime = `${Math.floor(Date.now() / 1000) + expiresIn}`;

  await AsyncStorage.setItem(AUTH_TOKEN_NAME, token);
  await AsyncStorage.setItem(AUTH_EXPIRES_IN_NAME, expiresInTime);
};

const getAuthToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(AUTH_TOKEN_NAME);
};

const setAuthInfo = async (info: Partial<IAuthInfo>) => {
  const authInfo = JSON.stringify(info);

  await AsyncStorage.setItem(AUTH_INFO, authInfo);
};

const getAuthInfo = async (): Promise<IAuthBaseInfo | null> => {
  try {
    const authInfoRaw = await AsyncStorage.getItem(AUTH_INFO);

    if (authInfoRaw) {
      // return JSON.parse(decodeURIComponent(authInfoRaw));
      return JSON.parse(authInfoRaw);
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

const removeAuthToken = async (): Promise<boolean> => {
  await AsyncStorage.multiRemove([AUTH_TOKEN_NAME, AUTH_EXPIRES_IN_NAME]);

  return true;
};

const removeAuthInfo = async (): Promise<boolean> => {
  await AsyncStorage.removeItem(AUTH_INFO);

  return true;
};

const removeAuth = async (): Promise<boolean> => {
  const removedAuthToken = await removeAuthToken();
  const removedAuthInfo = await removeAuthInfo();

  return removedAuthToken && removedAuthInfo;
};

const checkAuthIsAvailably = async (): Promise<boolean> => {
  const authToken = getAuthToken();

  if (!authToken) {
    await removeAuth();

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
