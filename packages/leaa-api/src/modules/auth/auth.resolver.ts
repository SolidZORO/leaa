import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { User } from '@leaa/common/src/entrys';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions, CurrentUser } from '@leaa/api/src/decorators';
import { AuthsWithPaginationObject, AuthsArgs, AuthLoginInput, AuthSignupInput } from '@leaa/common/src/dtos/auth';

import { AuthService } from './auth.service';
import { AuthLocalService } from './auth-local.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly authLocalService: AuthLocalService) {}

  @UseGuards(PermissionsGuard)
  @Permissions('auth.list-read')
  @Query(() => AuthsWithPaginationObject, { nullable: true })
  async auths(@Args() args: AuthsArgs, @CurrentUser() user?: User): Promise<AuthsWithPaginationObject | undefined> {
    return this.authService.auths(args, user);
  }

  @Mutation(() => User)
  async login(@Args('user') args: AuthLoginInput): Promise<User | undefined> {
    return this.authLocalService.login(args);
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
    return this.authLocalService.signup(args, oid);
  }
}
