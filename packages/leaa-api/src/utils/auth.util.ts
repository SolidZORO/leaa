import { User } from '@leaa/common/src/entrys';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { errorMsg } from '@leaa/api/src/utils';
import { IGqlCtx } from '@leaa/api/src/interfaces';

export const checkAvailableUser = (user: User | null, gqlCtx: IGqlCtx): User => {
  const { t } = gqlCtx;

  if (!user) {
    throw errorMsg(t('_error:usernameOrPasswordNotMatch'), { statusCode: 401 });
  }

  if (user && user.status !== 1) {
    throw errorMsg(t('_error:invalidUser'), { statusCode: 401 });
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
