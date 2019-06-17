import { User } from '../entrys';

const getFlatPermissions = (user: User): string[] => {
  let nextFlatPermissions: string[] = [];

  if (user && user.permissions && user.permissions.length && user.permissions.length > 0) {
    nextFlatPermissions = user.permissions.map(p => p.slug);
  }

  return nextFlatPermissions;
};

export const authUtil = {
  getFlatPermissions,
};
