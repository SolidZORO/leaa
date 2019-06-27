import { observable } from 'mobx';

import { IMenuItem } from '@leaa/dashboard/configs/menu.config';

export interface IMappingStoreDTO {
  menuMapping: IMenuItem[];
}

export class MappingStore {
  @observable menuMapping: IMenuItem[] = [];

  constructor(initData: IMappingStoreDTO) {
    this.menuMapping = initData.menuMapping || [];
  }
}
