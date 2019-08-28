import { Resolver } from '@nestjs/graphql';

import { User } from '@leaa/common/src/entrys';
// import { OauthService } from '@leaa/api/src/modules/oauth/oauth.service';

@Resolver(() => User)
export class OauthResolver {
  // constructor(private readonly oauthService: OauthService) {}
}
