import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Auth, User, Verification } from '@leaa/common/src/entrys';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { AuthsWithPaginationObject, AuthsArgs, AuthLoginInput, AuthSignupInput } from '@leaa/common/src/dtos/auth';
import { IGqlCtx } from '@leaa/api/src/interfaces';

import { AuthService } from './auth.service';
import { AuthLocalService } from './auth-local.service';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly authLocalService: AuthLocalService) {}

  @UseGuards(PermissionsGuard)
  @Permissions('auth.list-read')
  @Query(() => AuthsWithPaginationObject, { nullable: true })
  async auths(@Args() args: AuthsArgs, @GqlCtx() gqlCtx?: IGqlCtx): Promise<AuthsWithPaginationObject | undefined> {
    return this.authService.auths(args, gqlCtx);
  }

  // in permission.config.ts - notValidateUserQuerys
  @Query(() => Verification)
  async guest(
    @Args({ name: 'token', type: () => String, nullable: true }) token?: string,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Verification | undefined> {
    return this.authLocalService.guest(token, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('auth.item-delete')
  @Mutation(() => Auth)
  async deleteAuth(
    @Args({ name: 'id', type: () => String }) id: string,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Auth | undefined> {
    return this.authService.deleteAuth(id, gqlCtx);
  }

  //
  //

  @Mutation(() => User)
  async login(@Args('user') args: AuthLoginInput, @GqlCtx() gqlCtx?: IGqlCtx): Promise<User | undefined> {
    return this.authLocalService.login(args, gqlCtx);
  }

  @Mutation(() => User)
  async loginByTicket(
    @Args({ name: 'ticket', type: () => String }) ticket: string,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<User | undefined> {
    return this.authService.loginByTicket(ticket, gqlCtx);
  }

  @Mutation(() => User)
  async signup(
    @Args('user') args: AuthSignupInput,
    @Args({ name: 'uid', type: () => String, nullable: true }) uid?: string,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<User | undefined> {
    return this.authLocalService.signup(args, uid, gqlCtx);
  }
}
