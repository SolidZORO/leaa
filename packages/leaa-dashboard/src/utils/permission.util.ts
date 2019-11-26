import { AUTH_INFO } from '@leaa/dashboard/src/constants';
import { IAuthInfo } from '@leaa/dashboard/src/interfaces';

const hasPermission = (permissionName: string): boolean => {
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

  if (!authInfo.flatePermissions || !Array.isArray(authInfo.flatePermissions)) {
    return false;
  }

  return authInfo.flatePermissions.includes(permissionName);
};

export const permissionUtil = {
  hasPermission,
};
