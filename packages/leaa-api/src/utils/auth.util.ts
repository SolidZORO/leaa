import { User } from '@leaa/common/src/entrys';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { loggerUtil, errUtil } from '@leaa/api/src/utils';

const checkAvailableUser = (user?: User): User => {
  if (!user) {
    const message = errUtil.mapping.NOT_FOUND_USER.text;

    loggerUtil.warn(`${message}: ${JSON.stringify(user)}`, 'AuthUtil');
    return errUtil.ERROR({ error: message });
  }

  if (user && user.status !== 1) {
    const message = errUtil.mapping.INVALID_USER.text;

    loggerUtil.warn(`${message}: ${JSON.stringify(user)}`, 'AuthUtil');
    return errUtil.ERROR({ error: message });
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
