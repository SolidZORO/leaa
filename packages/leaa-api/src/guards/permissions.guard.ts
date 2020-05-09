import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common';

import { User } from '@leaa/common/src/entrys';
import { errorMsg } from '@leaa/api/src/utils';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { PermissionsMetadataKey } from '@leaa/api/src/decorators';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const permissions = this.reflector.get<IPermissionSlug[]>(PermissionsMetadataKey, context.getHandler());
    const gqlCtx = GqlExecutionContext.create(context).getContext();

    const { t } = gqlCtx;

    const user: User | undefined = gqlCtx?.user;

    if (!user) throw errorMsg(t('_error:unauthorized'), { gqlCtx });

    // signup user
    if (!user.is_admin && user.flatPermissions && user.flatPermissions.length === 0) return true;

    // not is admin
    if (!user.flatPermissions || user.flatPermissions.length <= 0) {
      throw errorMsg(t('_error:forbidden'), { gqlCtx });
    }

    return (
      user.flatPermissions &&
      user.flatPermissions.some((permission) => permissions && permissions.includes(permission as IPermissionSlug))
    );
  }
}
