import { configure } from 'mobx';
import { useStaticRendering } from 'mobx-react';
import { createContext, useContext } from 'react';

import { IMappingStore, MappingStore } from './mapping.store';
import { IAuthStore, AuthStore } from './auth.store';

export interface IStore {
  mapping?: IMappingStore;
  auth?: IAuthStore;
}

const isServer = typeof window === 'undefined';

// configure({ enforceActions: 'observed' });
configure({ enforceActions: 'never' });
useStaticRendering(isServer);

export class Store {
  public mapping: MappingStore;
  public auth: AuthStore;

  constructor(initData: IStore = {}) {
    this.mapping = new MappingStore(initData && initData.mapping);
    this.auth = new AuthStore(initData && initData.auth);
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
