import { Args, Query, Mutation, Resolver, Parent, ResolveProperty } from '@nestjs/graphql';
import { Int, Float } from 'type-graphql';

import { User } from '@leaa/common/entrys';
import {
  UsersArgs,
  UsersWithPaginationObject,
  UserArgs,
  CreateUserInput,
  UpdateUserInput,
} from '@leaa/common/dtos/user';
import { UserService } from '@leaa/api/modules/user/user.service';
import { UserProperty } from '@leaa/api/modules/user/user.property';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly userProperty: UserProperty) {}

  @ResolveProperty(() => [String])
  async flatePermissions(@Parent() user: User | undefined): Promise<string[] | undefined> {
    return this.userProperty.resolvePropertyFlatPermissions(user);
  }

  //
  //

  @Query(() => Float)
  async ram(): Promise<number> {
    return Math.random();
  }

  @Query(() => UsersWithPaginationObject)
  async users(@Args() args: UsersArgs): Promise<UsersWithPaginationObject | undefined> {
    return this.userService.users(args);
  }

  @Query(() => User)
  async user(@Args({ name: 'id', type: () => Int }) id: number, @Args() args?: UserArgs): Promise<User | undefined> {
    return this.userService.user(id, args);
  }

  @Query(() => User)
  async userByToken(
    @Args({ name: 'token', type: () => String, nullable: true }) token?: string,
    @Args() args?: UserArgs,
  ): Promise<User | undefined> {
    return this.userService.userByToken(token, args);
  }

  @Mutation(() => User)
  async createUser(@Args('user') args: CreateUserInput): Promise<User | undefined> {
    return this.userService.craeteUser(args);
  }

  @Mutation(() => User)
  async updateUser(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('user') args: UpdateUserInput,
  ): Promise<User | undefined> {
    return this.userService.updateUser(id, args);
  }

  @Mutation(() => User)
  async deleteUser(@Args({ name: 'id', type: () => Int }) id: number): Promise<User | undefined> {
    return this.userService.deleteUser(id);
  }
}
