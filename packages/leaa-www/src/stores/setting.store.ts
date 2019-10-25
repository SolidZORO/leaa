import { observable } from 'mobx';
import { IGlobalSetting } from '@leaa/www/src/interfaces';

export interface IMappingStore {
  globalSettings?: IGlobalSetting[];
}

export class SettingStore {
  @observable globalSettings: IGlobalSetting[] = [];

  constructor(initData?: IMappingStore) {
    this.globalSettings = initData && initData.globalSettings ? initData.globalSettings : this.globalSettings;
  }
}
