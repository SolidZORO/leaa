import { Request, Response } from 'express';

import { User } from '@leaa/common/src/entrys';

export interface IRequest extends Request {
  user?: User;
}

export type IResponse = Response;
