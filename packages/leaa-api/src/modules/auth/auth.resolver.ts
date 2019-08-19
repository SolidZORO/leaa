import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { User } from '@leaa/common/src/entrys';
import { AuthLoginInput, AuthRegisterInput } from '@leaa/common/src/dtos/auth';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Mutation(() => User)
  async login(@Args('user') args: AuthLoginInput): Promise<User | undefined> {
    return this.authService.login(args);
  }

  @Mutation(() => User)
  async register(@Args('user') args: AuthRegisterInput): Promise<User | undefined> {
    return this.userService.craeteUser(args);
  }
}
