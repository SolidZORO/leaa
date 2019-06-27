import { IMappingStoreDTO, MappingStore } from './mapping.store';

export interface IRootStoreDTO {
  mapping: IMappingStoreDTO;
}

export class RootStore {
  public mapping?: MappingStore;

  constructor(initData: IRootStoreDTO) {
    if (initData && initData.mapping) {
      this.mapping = new MappingStore(initData.mapping);
    }
  }
}
