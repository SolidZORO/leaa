import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Auth, User, Verification } from '@leaa/common/src/entrys';

import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { AuthsWithPaginationObject, AuthsArgs, AuthLoginInput, AuthSignupInput } from '@leaa/common/src/dtos/auth';
import { IGqlCtx } from '@leaa/api/src/interfaces';

import { AuthService } from './auth.service';
import { AuthLocalService } from './auth-local.service';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly authLocalService: AuthLocalService) {}

  @Permissions('auth.list-read')
  @Query(() => AuthsWithPaginationObject, { nullable: true })
  async auths(@GqlCtx() @Args() args: AuthsArgs): Promise<AuthsWithPaginationObject | undefined> {
    return this.authService.auths(gqlCtx, args);
  }

  // in permission.config.ts - notValidateUserQuerys
  @Query(() => Verification)
  async guest(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'token', type: () => String, nullable: true }) token?: string,
  ): Promise<Verification | undefined> {
    return this.authLocalService.guest(gqlCtx, token);
  }

  @Permissions('auth.item-delete')
  @Mutation(() => Auth)
  async deleteAuth(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Auth | undefined> {
    return this.authService.deleteAuth(gqlCtx, id);
  }

  //
  //

  @Mutation(() => User)
  async login(@GqlCtx() @Args('user') args: AuthLoginInput): Promise<User | undefined> {
    return this.authLocalService.login(gqlCtx, args);
  }

  @Mutation(() => User)
  async loginByTicket(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'ticket', type: () => String }) ticket: string,
  ): Promise<User | undefined> {
    return this.authService.loginByTicket(gqlCtx, ticket);
  }

  @Mutation(() => User)
  async signup(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args('user') args: AuthSignupInput,
    @Args({ name: 'uid', type: () => String, nullable: true }) uid?: string,
  ): Promise<User | undefined> {
    return this.authLocalService.signup(gqlCtx, args, uid);
  }
}
