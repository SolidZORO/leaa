import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { User } from '@leaa/common/src/entrys';
import { AuthLoginInput, AuthSignupInput } from '@leaa/common/src/dtos/auth';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async login(@Args('user') args: AuthLoginInput): Promise<User | undefined> {
    return this.authService.login(args);
  }

  @Mutation(() => User)
  async signup(@Args('user') args: AuthSignupInput): Promise<User | undefined> {
    return this.authService.signup(args);
  }
}
