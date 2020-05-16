import ICore from 'express-serve-static-core';
import { TFunction } from 'i18next';

import { User, Auth } from '@leaa/common/src/entrys';
import { IHttpException } from '@leaa/api/src/filters';
import { IHttpData } from '@leaa/api/src/interceptors';
import { CrudRequest, BaseRoute } from '@nestjsx/crud';

export interface IRequest extends ICore.Request {
  user?: User;
  body: any;
  query: any;
  language: string;
  t: TFunction;
}

export interface IResponse extends ICore.Response {}

export declare type IApiResponse<T> = IHttpData<T> | IHttpException;

//
//

export interface ICrudRequest extends CrudRequest {
  user?: User;
  body: any;
  ip: any;
  query: any;
  route?: BaseRoute;
  language: string;
  t: TFunction;
}

//
//

export interface IRequestGithubCallback extends ICore.Request {
  user?: {
    userInfo: User;
    userAuth: Auth;
  };
}
