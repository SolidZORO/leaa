import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { User } from '@leaa/common/src/entrys';
import { AuthLoginInput, AuthSignupInput } from '@leaa/common/src/dtos/auth';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { Int } from 'type-graphql';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async login(@Args('user') args: AuthLoginInput): Promise<User | undefined> {
    console.log(11111111, args);
    return this.authService.login(args);
  }

  @Mutation(() => User)
  async loginByTicket(@Args({ name: 'ticket', type: () => String }) ticket: string): Promise<User | undefined> {
    return this.authService.loginByTicket(ticket);
  }

  @Mutation(() => User)
  async signup(
    @Args('user') args: AuthSignupInput,
    @Args({ name: 'oid', type: () => Int, nullable: true }) oid?: number,
  ): Promise<User | undefined> {
    return this.authService.signup(args, oid);
  }
}
