import { User } from '@leaa/common/src/entrys';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { loggerUtil } from '@leaa/api/src/utils';

const checkAvailabilityUser = (user: User): boolean => {
  let errorMessage = '';

  if (!user) {
    errorMessage = 'Invalid User';
  }

  if (user && user.status && Number(user.status) !== 1) {
    errorMessage = 'Disabled User';
  }

  if (errorMessage !== '') {
    loggerUtil.warn(`${errorMessage}: ${JSON.stringify(user)}`, 'authUtil');
    return false;
  }

  return true;
};

const can = (user: User, permissionName: IPermissionSlug): boolean => {
  if (!user || !permissionName || !user.flatPermissions) {
    return false;
  }

  return user && user.flatPermissions && user.flatPermissions.includes(permissionName);
};

export const authUtil = {
  checkAvailableUser: checkAvailabilityUser,
  can,
};
