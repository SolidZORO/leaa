import { User } from '@leaa/common/src/entrys';
import { loggerUtil } from '@leaa/api/src/utils';

const checkAvailabilityUser = (user: User): boolean => {
  let errorMessage = '';

  if (!user) {
    errorMessage = 'Invalid User';
  }

  if (user && user.status !== 1) {
    errorMessage = 'Disabled User';
  }

  if (errorMessage !== '') {
    loggerUtil.warn(`${errorMessage}: ${JSON.stringify(user)}`, 'authUtil');
    return false;
  }

  return true;
};

const hasPermission = (user: User, permissionName: string): boolean => {
  if (!user || !permissionName || !user.flatePermissions) {
    return false;
  }

  return user && user.flatePermissions && user.flatePermissions.includes(permissionName);
};

export const authUtil = {
  checkAvailabilityUser,
  hasPermission,
};
