import { configure } from 'mobx';

import { IRootStoreDTO, RootStore } from './root.store';

configure({ enforceActions: 'observed' });

export { RootStore };

export function initStore(initData: IRootStoreDTO) {
  return new RootStore(initData);
}
