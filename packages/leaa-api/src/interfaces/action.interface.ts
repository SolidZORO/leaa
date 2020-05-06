import { FindOneOptions } from 'typeorm';
import { ActionsArgs, ActionArgs } from '@leaa/common/src/dtos/action';
import { Action } from '@leaa/common/src/entrys';

export type IActionsArgs = ActionsArgs & FindOneOptions<Action>;
export type IActionArgs = ActionArgs & FindOneOptions<Action>;
