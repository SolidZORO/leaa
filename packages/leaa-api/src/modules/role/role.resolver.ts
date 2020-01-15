import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

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
  async roles(@Args() args: RolesArgs): Promise<RolesWithPaginationObject | undefined> {
    return this.roleService.roles(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('role.item-read')
  @Query(() => Role)
  async role(@Args({ name: 'id', type: () => Int }) id: number, @Args() args?: RoleArgs): Promise<Role | undefined> {
    return this.roleService.role(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('role.item-create')
  @Mutation(() => Role)
  async createRole(@Args('role') args: CreateRoleInput): Promise<Role | undefined> {
    return this.roleService.createRole(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('role.item-update')
  @Mutation(() => Role)
  async updateRole(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('role') args: UpdateRoleInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Role | undefined> {
    return this.roleService.updateRole(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('role.item-delete')
  @Mutation(() => Role)
  async deleteRole(
    @Args({ name: 'id', type: () => Int }) id: number,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Role | undefined> {
    return this.roleService.deleteRole(id, gqlCtx);
  }
}
