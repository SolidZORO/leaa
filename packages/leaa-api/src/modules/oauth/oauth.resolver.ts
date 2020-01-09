import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { Oauth, User } from '@leaa/common/src/entrys';
import { OauthsArgs, OauthsWithPaginationObject } from '@leaa/common/src/dtos/oauth';
import { OauthService } from '@leaa/api/src/modules/oauth/oauth.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions, CurrentUser } from '@leaa/api/src/decorators';

@Resolver(() => Oauth)
export class OauthResolver {
  constructor(private readonly oauthService: OauthService) {}

  @UseGuards(PermissionsGuard)
  @Permissions('oauth.list-read')
  @Query(() => OauthsWithPaginationObject, { nullable: true })
  async oauths(@Args() args: OauthsArgs, @CurrentUser() user?: User): Promise<OauthsWithPaginationObject | undefined> {
    return this.oauthService.oauths(args, user);
  }
}
