import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql';

import { Role } from '@leaa/common/src/entrys';
import {
  RolesArgs,
  RolesWithPaginationObject,
  RoleArgs,
  CreateRoleInput,
  UpdateRoleInput,
} from '@leaa/common/src/dtos/role';
import { RoleService } from '@leaa/api/src/modules/role/role.service';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(PermissionsGuard)
  @Permissions('role.list-read')
  @Query(() => RolesWithPaginationObject)
  async roles(@GqlCtx() gqlCtx: IGqlCtx, @Args() args: RolesArgs): Promise<RolesWithPaginationObject | undefined> {
    return this.roleService.roles(gqlCtx, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('role.item-read')
  @Query(() => Role)
  async role(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: RoleArgs,
  ): Promise<Role | undefined> {
    return this.roleService.role(gqlCtx, id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('role.item-create')
  @Mutation(() => Role)
  async createRole(@GqlCtx() gqlCtx: IGqlCtx, @Args('role') args: CreateRoleInput): Promise<Role | undefined> {
    return this.roleService.createRole(gqlCtx, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('role.item-update')
  @Mutation(() => Role)
  async updateRole(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('role') args: UpdateRoleInput,
  ): Promise<Role | undefined> {
    return this.roleService.updateRole(gqlCtx, id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('role.item-delete')
  @Mutation(() => Role)
  async deleteRole(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Role | undefined> {
    return this.roleService.deleteRole(gqlCtx, id);
  }
}
