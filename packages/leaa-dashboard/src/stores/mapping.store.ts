import { observable } from 'mobx';

export interface IMappingStore {
  orderStatusMapping?: string[];
  abcMapping?: string[];
}

export class MappingStore {
  @observable orderStatusMapping: string[] = ['paid', 'finished', 'padding'];
  @observable abcMapping: string[] = [];

  constructor(initData?: IMappingStore) {
    this.orderStatusMapping =
      initData && initData.orderStatusMapping && initData.orderStatusMapping.length
        ? initData.orderStatusMapping
        : this.orderStatusMapping;
    this.abcMapping =
      initData && initData.abcMapping && initData.abcMapping.length ? initData.abcMapping : this.abcMapping;
  }
}
