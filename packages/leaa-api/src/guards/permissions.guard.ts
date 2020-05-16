import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { IRequest } from '@leaa/api/src/interfaces';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const needPermissions: string[] | undefined = this.reflector.get<IPermissionSlug[]>(
      'permissions',
      context.getHandler(),
    );

    if (!needPermissions || (needPermissions && needPermissions.length === 0)) return true;

    const req: IRequest = context.switchToHttp().getRequest();
    const userPermissions: string[] | undefined = req.user?.flatPermissions;

    if (!userPermissions || (userPermissions && userPermissions.length === 0)) return false;

    return needPermissions.every((np) => userPermissions.includes(np));
  }
}
