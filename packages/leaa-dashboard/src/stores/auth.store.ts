import { observable } from 'mobx';

export interface IAuthStore {
  permissions?: string[];
  authToken?: string;
}

export class AuthStore {
  @observable permissions = ['paid', 'finished', 'padding'];
  @observable authToken = '-- AUTH-TOKEN -- ';

  constructor(initData?: IAuthStore) {
    this.permissions = (initData && initData.permissions) || this.permissions;
    this.authToken = (initData && initData.authToken) || this.authToken;
  }
}
