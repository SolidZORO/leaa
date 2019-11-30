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
import { UserDecorator } from '@leaa/api/src/decorators';

@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Query(() => PermissionsWithPaginationObject)
  async permissions(
    @Args() args: PermissionsArgs,
    @UserDecorator() user?: User,
  ): Promise<PermissionsWithPaginationObject> {
    return this.permissionService.permissions(args, user);
  }

  @Query(() => Permission)
  async permission(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args: PermissionArgs,
    @UserDecorator() user?: User,
  ): Promise<Permission | undefined> {
    return this.permissionService.permission(id, args, user);
  }

  @Mutation(() => Permission)
  async createPermission(
    @Args('permission') args: CreatePermissionInput,
    @UserDecorator() user?: User,
  ): Promise<Permission | undefined> {
    return this.permissionService.createPermission(args, user);
  }

  @Mutation(() => Permission)
  async updatePermission(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('permission') args: UpdatePermissionInput,
    @UserDecorator() user?: User,
  ): Promise<Permission | undefined> {
    return this.permissionService.updatePermission(id, args, user);
  }

  @Mutation(() => Permission)
  async deletePermission(
    @Args({ name: 'id', type: () => Int }) id: number,
    @UserDecorator() user?: User,
  ): Promise<Permission | undefined> {
    return this.permissionService.deletePermission(id, user);
  }
}
