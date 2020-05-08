import { User } from '@leaa/common/src/entrys';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { msgError } from '@leaa/api/src/utils';
import { IGqlCtx } from '@leaa/api/src/interfaces';

export const checkAvailableUser = (user?: User, gqlCtx?: IGqlCtx): User => {
  if (!user) {
    throw msgError({ t: ['_error:usernameOrPasswordNotMatch'], gqlCtx, statusCode: 401 });
  }

  if (user && user.status !== 1) {
    throw msgError({ t: ['_error:invalidUser'], gqlCtx, statusCode: 401 });
  }

  return user;
};

export const can = (user: User, permissionName: IPermissionSlug): boolean => {
  if (!user || !permissionName || !user.flatPermissions) {
    return false;
  }

  return user && user.flatPermissions && user.flatPermissions.includes(permissionName);
};

// export const isAdmin = (gqlCtx?: IGqlCtx): boolean => gqlCtx?.user?.is_admin === 1;
