import { User } from '@leaa/common/src/entrys';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { msgUtil } from '@leaa/api/src/utils';
import { IGqlCtx } from '@leaa/api/src/interfaces';

const checkAvailableUser = (user?: User, gqlCtx?: IGqlCtx): User => {
  if (!user) {
    return msgUtil.error({ t: ['_error:notFoundUser'], gqlCtx });
  }

  if (user && user.status !== 1) {
    return msgUtil.error({ t: ['_error:invalidUser'], gqlCtx });
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
