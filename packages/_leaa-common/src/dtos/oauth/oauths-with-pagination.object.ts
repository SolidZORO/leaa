import { ObjectType, Field } from 'type-graphql';

import { Oauth } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class OauthsWithPaginationObject extends PaginationObject {
  @Field(() => [Oauth])
  readonly items: Oauth[] = [];
}
