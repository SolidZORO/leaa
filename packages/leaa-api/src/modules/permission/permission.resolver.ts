import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Permission, User } from '@leaa/common/src/entrys';
import {
  PermissionsArgs,
  PermissionsWithPaginationObject,
  PermissionArgs,
  CreatePermissionInput,
  UpdatePermissionInput,
} from '@leaa/common/src/dtos/permission';
import { PermissionService } from '@leaa/api/src/modules/permission/permission.service';
import { CurrentUser, Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(PermissionsGuard)
  @Permissions('permission.list-read')
  @Query(() => PermissionsWithPaginationObject)
  async permissions(@Args() args: PermissionsArgs): Promise<PermissionsWithPaginationObject> {
    return this.permissionService.permissions(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('permission.item-read')
  @Query(() => Permission)
  async permission(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args: PermissionArgs,
  ): Promise<Permission | undefined> {
    return this.permissionService.permission(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('permission.item-create')
  @Mutation(() => Permission)
  async createPermission(@Args('permission') args: CreatePermissionInput): Promise<Permission | undefined> {
    return this.permissionService.createPermission(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('permission.item-update')
  @Mutation(() => Permission)
  async updatePermission(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('permission') args: UpdatePermissionInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Permission | undefined> {
    return this.permissionService.updatePermission(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('permission.item-delete')
  @Mutation(() => Permission)
  async deletePermission(
    @Args({ name: 'id', type: () => Int }) id: number,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Permission | undefined> {
    return this.permissionService.deletePermission(id, gqlCtx);
  }
}
