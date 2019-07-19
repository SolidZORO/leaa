import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Role } from '@leaa/common/entrys';
import {
  RolesArgs,
  RolesWithPaginationObject,
  RoleArgs,
  CreateRoleInput,
  UpdateRoleInput,
} from '@leaa/common/dtos/role';
import { RoleService } from './role.service';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => RolesWithPaginationObject)
  async roles(@Args() args?: RolesArgs): Promise<RolesWithPaginationObject | undefined> {
    return this.roleService.roles(args);
  }

  @Query(() => Role)
  async role(@Args({ name: 'id', type: () => Int }) id: number, @Args() args?: RoleArgs): Promise<Role | undefined> {
    return this.roleService.role(id, args);
  }

  @Mutation(() => Role)
  async createRole(@Args('role') args: CreateRoleInput): Promise<Role | undefined> {
    return this.roleService.craeteRole(args);
  }

  @Mutation(() => Role)
  async updateRole(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('role') args: UpdateRoleInput,
  ): Promise<Role | undefined> {
    return this.roleService.updateRole(id, args);
  }

  @Mutation(() => Role)
  async deleteRole(@Args({ name: 'id', type: () => Int }) id: number): Promise<Role | undefined> {
    return this.roleService.deleteRole(id);
  }
}
