import { configure } from 'mobx';
import { useStaticRendering } from 'mobx-react-lite';
import { createContext, useContext } from 'react';

import { IMappingStore, SettingStore } from './setting.store';

export interface IStore {
  setting?: IMappingStore;
}

const isServer = typeof window === 'undefined';

configure({ enforceActions: 'observed' });
useStaticRendering(isServer);

export class Store {
  setting: SettingStore;

  constructor(initData: IStore) {
    this.setting = new SettingStore(initData?.setting);
  }
}

let store: Store;

export const initStore = (storeData: IStore): Store => {
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

export const StoreContext = createContext({} as Store);
export const StoreProvider = StoreContext.Provider;

export const useStore = (): Store => useContext(StoreContext);
