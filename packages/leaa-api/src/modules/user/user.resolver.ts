import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Parent, ResolveProperty } from '@nestjs/graphql';
import { Int, Float } from 'type-graphql';

import { User, Permission } from '@leaa/common/src/entrys';
import {
  UsersArgs,
  UsersWithPaginationObject,
  UserArgs,
  CreateUserInput,
  UpdateUserInput,
} from '@leaa/common/src/dtos/user';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';
import { CurrentUser, Permissions } from '@leaa/api/src/decorators';
import { PermissionsGuard } from '@leaa/api/src/guards';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly userProperty: UserProperty) {}

  @ResolveProperty(() => [String])
  async flatePermissions(@Parent() user: User | undefined): Promise<string[] | undefined> {
    return this.userProperty.flatPermissions(user);
  }

  @ResolveProperty(() => [String])
  async permissions(@Parent() user: User | undefined): Promise<Permission[] | undefined> {
    return this.userProperty.permissions(user);
  }

  //

  // fot Test GraphQL
  @Query(() => Float)
  async ram(): Promise<number> {
    return Math.random();
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.list-read')
  @Query(() => UsersWithPaginationObject)
  async users(@Args() args: UsersArgs, @CurrentUser() user?: User): Promise<UsersWithPaginationObject | undefined> {
    return this.userService.users(args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-read')
  @Query(() => User)
  async user(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: UserArgs,
    @CurrentUser() user?: User,
  ): Promise<User | undefined> {
    return this.userService.user(id, args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-read')
  @Query(() => User)
  async userByToken(
    @Args({ name: 'token', type: () => String, nullable: true }) token?: string,
    @Args() args?: UserArgs,
  ): Promise<User | undefined> {
    return this.userService.userByToken(token, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-create')
  @Mutation(() => User)
  async createUser(@Args('user') args: CreateUserInput, @CurrentUser() user?: User): Promise<User | undefined> {
    return this.userService.createUser(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-update')
  @Mutation(() => User)
  async updateUser(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('user') args: UpdateUserInput,
    @CurrentUser() user?: User,
  ): Promise<User | undefined> {
    return this.userService.updateUser(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('user.item-delete')
  @Mutation(() => User)
  async deleteUser(
    @Args({ name: 'id', type: () => Int }) id: number,
    @CurrentUser() user?: User,
  ): Promise<User | undefined> {
    return this.userService.deleteUser(id, user);
  }
}
