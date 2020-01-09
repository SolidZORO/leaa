import { Request, Response } from 'express';

import { User, Auth } from '@leaa/common/src/entrys';

export interface IRequest extends Request {
  user?: User;
}

export interface IRequestGithubCallback extends Request {
  user?: {
    userInfo: User;
    userAuth: Auth;
  };
}

export type IResponse = Response;
