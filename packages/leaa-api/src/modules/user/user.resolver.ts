import { Args, Query, Resolver } from '@nestjs/graphql';

import { User } from '@leaa/common/entrys';
import { GetUsersArgsDto, GetUsersObjectDto } from '@leaa/common/dtos/user';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => GetUsersObjectDto)
  async users(@Args() args: GetUsersArgsDto): Promise<GetUsersObjectDto> {
    const [items, total] = await this.userService.getUsers(args);

    return {
      items,
      total,
    };
  }
}
