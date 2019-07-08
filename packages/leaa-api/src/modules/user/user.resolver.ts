import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { User } from '@leaa/common/entrys';
import { UsersArgs, UsersObject, UserArgs, CreateUserInput, UpdateUserInput } from '@leaa/common/dtos/user';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UsersObject)
  async users(@Args() args: UsersArgs): Promise<UsersObject> {
    return this.userService.users(args);
  }

  @Query(() => User)
  async user(@Args({ name: 'id', type: () => Int }) id: number, @Args() args?: UserArgs): Promise<User | undefined> {
    return this.userService.user(id, args);
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
