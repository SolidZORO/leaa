import { FindOneOptions } from 'typeorm';
import { AxsArgs, AxArgs } from '@leaa/common/src/dtos/ax';
import { Ax } from '@leaa/common/src/entrys';

export type IAxsArgs = AxsArgs & FindOneOptions<Ax>;
export type IAxArgs = AxArgs & FindOneOptions<Ax>;
