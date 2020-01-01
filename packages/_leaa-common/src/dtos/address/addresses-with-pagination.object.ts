import { ObjectType, Field } from 'type-graphql';

import { Address } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

@ObjectType()
export class AddressesWithPaginationObject extends PaginationObject {
  @Field(() => [Address])
  readonly items: Address[] = [];
}
