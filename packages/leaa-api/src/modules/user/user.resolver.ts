import { Args, Query, Resolver } from '@nestjs/graphql';

import { User } from '@leaa/common/entrys';
import { UsersArgs, UsersResponse } from '@leaa/common/dtos/user';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UsersResponse)
  async users(@Args() args: UsersArgs): Promise<UsersResponse> {
    return this.userService.users(args);
  }
}
