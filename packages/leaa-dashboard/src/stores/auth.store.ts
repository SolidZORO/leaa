import { observable } from 'mobx';

// import { IAuthInfo } from '@leaa/dashboard/src/interfaces';

export interface IAuthStore {
  permissions?: string[];
  authToken?: string;
  // authInfo?: IAuthInfo;
}

export class AuthStore {
  @observable permissions = ['paid', 'finished', 'padding'];
  @observable authToken = 'AUTH-TOKEN';
  // @observable authInfo: IAuthInfo = {
  //   name: '',
  //   flatPermissions: [],
  // };

  constructor(initData?: IAuthStore) {
    this.permissions = (initData && initData.permissions) || this.permissions;
    this.authToken = (initData && initData.authToken) || this.authToken;
    // this.authInfo = (initData && initData.authInfo) || this.authInfo;
  }
}
