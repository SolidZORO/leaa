import { User } from '@leaa/common/src/entrys';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { UnauthorizedException } from '@nestjs/common';

export const checkAvailableUser = (user?: User): User => {
  if (!user || (user && user.status !== 1)) throw new UnauthorizedException();

  return user;
};

export const can = (user: User, permissionName: IPermissionSlug): boolean => {
  if (!user || !permissionName || !user.flatPermissions) return false;

  return user && user.flatPermissions && user.flatPermissions.includes(permissionName);
};
