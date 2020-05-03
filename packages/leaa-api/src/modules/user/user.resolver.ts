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
  async users(@Args() args: UsersArgs, @GqlCtx() gqlCtx?: IGqlCtx): Promise<UsersWithPaginationObject | undefined> {
    return this.userService.users(args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-read')
  @Query(() => User)
  async user(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: UserArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<User | undefined> {
    return this.userService.user(id, args, gqlCtx);
  }

  @Query(() => User)
  async userByToken(
    @Args({ name: 'token', type: () => String, nullable: true }) token?: string,
    @Args() args?: UserArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<User | undefined> {
    return this.userService.userByToken(token, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-create')
  @Mutation(() => User)
  async createUser(@Args('user') args: CreateUserInput): Promise<User | undefined> {
    return this.userService.createUser(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-update')
  @Mutation(() => User)
  async updateUser(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('user') args: UpdateUserInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<User | undefined> {
    return this.userService.updateUser(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-delete')
  @Mutation(() => User)
  async deleteUser(
    @Args({ name: 'id', type: () => String }) id: string,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<User | undefined> {
    return this.userService.deleteUser(id, gqlCtx);
  }
}
