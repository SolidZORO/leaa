import { FindOneOptions } from 'typeorm';
import { ActionGetManyReq, ActionGetOneReq } from '@leaa/api/src/dtos/action';
import { Action } from '@leaa/api/src/entrys';

export type IActionsArgs = ActionGetManyReq & FindOneOptions<Action>;
export type IActionArgs = ActionGetOneReq & FindOneOptions<Action>;

export type ICreateOneCaptchaOptions = {
  module: string;
  action: string;
};

export type ICaptchaResult = {
  img: string;
  count?: number;
};
