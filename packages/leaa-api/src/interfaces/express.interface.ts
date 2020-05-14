import ICore from 'express-serve-static-core';
import { TFunction } from 'i18next';

import { User, Auth } from '@leaa/common/src/entrys';
import { CrudRequest, RoutesOptions, BaseRoute } from '@nestjsx/crud';

export interface IRequest extends ICore.Request {
  user?: User;
  body: any;
  query: any;
  language: string;
  t: TFunction;
}

export interface ICrudRequest extends CrudRequest {
  user?: User;
  body: any;
  ip: any;
  query: any;
  route?: BaseRoute;
  language: string;
  t: TFunction;
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
