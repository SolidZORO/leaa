import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Parent, ResolveField, Int } from '@nestjs/graphql';

import { User, Permission } from '@leaa/common/src/entrys';
import {
  UsersArgs,
  UsersWithPaginationObject,
  UserArgs,
  CreateUserInput,
  UpdateUserInput,
} from '@leaa/common/src/dtos/user';
import { IGqlCtx } from '@leaa/api/src/interfaces';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { PermissionsGuard } from '@leaa/api/src/guards';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly userProperty: UserProperty) {}

  @ResolveField(() => [String], { nullable: true })
  async flatPermissions(@Parent() user: User | undefined): Promise<string[] | undefined> {
    return this.userProperty.flatPermissions(user);
  }

  @ResolveField(() => [Permission], { nullable: true })
  async permissions(@Parent() user: User | undefined): Promise<Permission[] | undefined> {
    return this.userProperty.permissions(user);
  }

  //
  //

  @UseGuards(PermissionsGuard)
  @Permissions('user.list-read')
  @Query(() => UsersWithPaginationObject)
  async users(@GqlCtx() gqlCtx: IGqlCtx, @Args() args: UsersArgs): Promise<UsersWithPaginationObject | undefined> {
    return this.userService.users(gqlCtx, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-read')
  @Query(() => User)
  async user(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: UserArgs,
  ): Promise<User | undefined> {
    return this.userService.user(gqlCtx, id, args);
  }

  @Query(() => User)
  async userByToken(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'token', type: () => String, nullable: true }) token?: string,
    @Args() args?: UserArgs,
  ): Promise<User | undefined> {
    return this.userService.userByToken(gqlCtx, token, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-create')
  @Mutation(() => User)
  async createUser(@GqlCtx() gqlCtx: IGqlCtx, @Args('user') args: CreateUserInput): Promise<User | undefined> {
    return this.userService.createUser(gqlCtx, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-update')
  @Mutation(() => User)
  async updateUser(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('user') args: UpdateUserInput,
  ): Promise<User | undefined> {
    return this.userService.updateUser(gqlCtx, id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-delete')
  @Mutation(() => User)
  async deleteUser(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<User | undefined> {
    return this.userService.deleteUser(gqlCtx, id);
  }
}
