import { User } from '@leaa/api/src/entrys';
import { IPermissionSlug } from '@leaa/api/src/interfaces';
import { NotFoundUserException } from '@leaa/api/src/exceptions';
import { BadRequestException } from '@nestjs/common';

export function checkUserIsEnable(user?: User): User {
  if (!user || (user && user.status !== 1)) throw new NotFoundUserException();

  return user;
}

export function checkUserIsAdmin(user?: User): User {
  if (!user || (user && user.status !== 1 && user.is_admin !== 1)) throw new NotFoundUserException();

  return user;
}

export function can(user: User, permissionName: IPermissionSlug): boolean {
  if (!user || !permissionName || !user.flatPermissions) return false;

  return user && user.flatPermissions && user.flatPermissions.includes(permissionName);
}

export function checkGuthorization(guthorization?: string): string {
  if (!guthorization) throw new BadRequestException('Missing Guthorization');
  if (guthorization.length < 8) throw new BadRequestException('Guthorization Size Error');

  return guthorization;
}
