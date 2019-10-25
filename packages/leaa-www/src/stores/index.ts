import { configure } from 'mobx';
import { useStaticRendering } from 'mobx-react';
import { createContext, useContext } from 'react';

import { IMappingStore, SettingStore } from './setting.store';

export interface IStore {
  setting?: IMappingStore;
}

const isServer = typeof window === 'undefined';

configure({ enforceActions: 'observed' });
useStaticRendering(isServer);

export class Store {
  public setting: SettingStore;

  constructor(initData: IStore = {}) {
    this.setting = new SettingStore(initData && initData.setting);
  }
}

let store: Store;

export const initStore = (storeData: IStore = {}): Store => {
  if (isServer) {
    store = new Store(storeData);
    return store;
  }

  if (typeof store !== 'undefined') {
    return store;
  }

  store = new Store(storeData);
  return store;
};

export const StoreContext = createContext({});
export const StoreProvider = StoreContext.Provider;

// @ts-ignore
export const useStore = (): Store => useContext(StoreContext);
