import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Role } from '@leaa/common/entrys';
import { RolesArgs, RolesObject, RoleArgs, CreateRoleInput, UpdateRoleInput } from '@leaa/common/dtos/role';
import { RoleService } from './role.service';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => RolesObject)
  async roles(@Args() args: RolesArgs): Promise<RolesObject> {
    return this.roleService.roles(args);
  }

  @Query(() => Role)
  async role(@Args() args: RoleArgs): Promise<Role | undefined> {
    return this.roleService.role(args);
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
