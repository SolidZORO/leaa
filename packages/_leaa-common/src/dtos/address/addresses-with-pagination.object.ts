import { Address } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class AddressesWithPaginationObject extends PaginationObject {
  readonly items: Address[] = [];
}
