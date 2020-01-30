import { User } from '@leaa/common/src/entrys';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { msgUtil } from '@leaa/api/src/utils';
import { IGqlCtx } from '@leaa/api/src/interfaces';

const checkAvailableUser = (user?: User, gqlCtx?: IGqlCtx): User => {
  if (!user) {
    throw msgUtil.error({ t: ['_error:notFoundUser'], gqlCtx, statusCode: 401 });
  }

  if (user && user.status !== 1) {
    throw msgUtil.error({ t: ['_error:invalidUser'], gqlCtx, statusCode: 401 });
  }

  return user;
};

const can = (user: User, permissionName: IPermissionSlug): boolean => {
  if (!user || !permissionName || !user.flatPermissions) {
    return false;
  }

  return user && user.flatPermissions && user.flatPermissions.includes(permissionName);
};

const isAdmin = (gqlCtx?: IGqlCtx): boolean => gqlCtx?.user?.is_admin === 1;

export const authUtil = {
  checkAvailableUser,
  can,
  isAdmin,
};
