import { FindOneOptions } from 'typeorm';
import { AxGetManyReq, AxGetOneReq } from '@leaa/common/src/dtos/ax';
import { Ax } from '@leaa/common/src/entrys';

export type IAxsArgs = AxGetManyReq & FindOneOptions<Ax>;
export type IAxArgs = AxGetOneReq & FindOneOptions<Ax>;
