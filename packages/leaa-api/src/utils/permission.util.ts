import { User } from '@leaa/common/src/entrys';

const hasPermission = (user: User, permissionName: string): boolean => {
  if (!user || !permissionName || !user.flatePermissions) {
    return false;
  }

  return user && user.flatePermissions && user.flatePermissions.includes(permissionName);
};

export const permissionUtil = {
  hasPermission,
};
