import { Setting } from '@leaa/common/src/entrys';
import { PaginationObject } from '@leaa/common/src/dtos/_common';

export class SettingsWithPaginationObject extends PaginationObject {
  readonly items: Setting[] = [];
}
