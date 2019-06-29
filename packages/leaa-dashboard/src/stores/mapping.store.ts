import { observable } from 'mobx';

export interface IMappingStore {
  orderStatusMapping?: string[];
  abcMapping?: string[];
}

export class MappingStore {
  @observable orderStatusMapping: string[] = ['paid', 'finished', 'padding'];
  @observable abcMapping: string[] = ['A', 'B', 'C'];

  constructor(initData?: IMappingStore) {
    this.orderStatusMapping = (initData && initData.orderStatusMapping) || this.orderStatusMapping;
    this.abcMapping = (initData && initData.abcMapping) || this.abcMapping;
  }
}
