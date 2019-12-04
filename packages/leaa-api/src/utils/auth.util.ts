import { User } from '@leaa/common/src/entrys';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { loggerUtil, errorUtil } from '@leaa/api/src/utils';

const checkAvailableUser = (user: User): User | Error => {
  if (!user) {
    const message = 'NOT FOUND USER';

    loggerUtil.warn(`${message}: ${JSON.stringify(user)}`, 'AuthUtil');
    return errorUtil.ERROR({ error: message });
  }

  if (user && user.status !== 1) {
    const message = 'INVALID USER';

    loggerUtil.warn(`${message}: ${JSON.stringify(user)}`, 'AuthUtil');
    return errorUtil.ERROR({ error: message });
  }

  return user;
};

const can = (user: User, permissionName: IPermissionSlug): boolean => {
  if (!user || !permissionName || !user.flatPermissions) {
    return false;
  }

  return user && user.flatPermissions && user.flatPermissions.includes(permissionName);
};

export const authUtil = {
  checkAvailableUser,
  can,
};
