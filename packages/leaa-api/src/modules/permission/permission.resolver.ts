import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Permission } from '@leaa/common/entrys';
import {
  PermissionsArgs,
  PermissionsWithPaginationObject,
  PermissionArgs,
  CreatePermissionInput,
  UpdatePermissionInput,
} from '@leaa/common/dtos/permission';
import { PermissionService } from '@leaa/api/modules/permission/permission.service';

@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Query(() => PermissionsWithPaginationObject)
  async permissions(@Args() args: PermissionsArgs): Promise<PermissionsWithPaginationObject> {
    return this.permissionService.permissions(args);
  }

  @Query(() => Permission)
  async permission(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args: PermissionArgs,
  ): Promise<Permission | undefined> {
    return this.permissionService.permission(id, args);
  }

  @Mutation(() => Permission)
  async createPermission(@Args('permission') args: CreatePermissionInput): Promise<Permission | undefined> {
    return this.permissionService.craetePermission(args);
  }

  @Mutation(() => Permission)
  async updatePermission(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('permission') args: UpdatePermissionInput,
  ): Promise<Permission | undefined> {
    return this.permissionService.updatePermission(id, args);
  }

  @Mutation(() => Permission)
  async deletePermission(@Args({ name: 'id', type: () => Int }) id: number): Promise<Permission | undefined> {
    return this.permissionService.deletePermission(id);
  }
}
