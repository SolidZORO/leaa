import ICore from 'express-serve-static-core';

import { User, Auth } from '@leaa/common/src/entrys';

export interface IRequest extends ICore.Request {
  user?: User;
  body: any;
  query: any;
}

export interface IResponse extends ICore.Response {
  // user?: User;
  // headers: {
  //   lang?: string;
  //   authorization?: string;
  // };
  // body: any;
  // query: any;
}

export interface IRequestGithubCallback extends ICore.Request {
  user?: {
    userInfo: User;
    userAuth: Auth;
  };
}

// export type IResponse = Response;
