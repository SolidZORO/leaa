import { configure } from 'mobx';
import { useStaticRendering } from 'mobx-react-lite';
import { createContext, useContext } from 'react';

import { IAuthStore, AuthStore } from '@leaa/app/src/stores/auth.store';

export interface IStore {
  auth?: IAuthStore;
}

const isServer = typeof window === 'undefined';

configure({ enforceActions: 'observed' });
useStaticRendering(isServer);

export class Store {
  public auth: AuthStore;

  constructor(initData: IStore = {}) {
    this.auth = new AuthStore(initData && initData.auth);
  }
}

let store: Store;

export const initStore = (storeData: IStore = {}): Store => {
  if (typeof store !== 'undefined') {
    return store;
  }

  store = new Store(storeData);

  return store;
};

export const StoreContext = createContext({} as Store);
export const StoreProvider = StoreContext.Provider;
export const useStore = (): Store => useContext(StoreContext);
