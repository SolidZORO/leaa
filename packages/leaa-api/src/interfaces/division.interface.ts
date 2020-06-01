import { FindOneOptions } from 'typeorm';
import { DivisionGetManyReq, DivisionGetOneReq } from '@leaa/common/src/dtos/division';
import { Division } from '@leaa/common/src/entrys';

export type IDivisionsArgs = DivisionGetManyReq & FindOneOptions<Division>;
export type IDivisionArgs = DivisionGetOneReq & FindOneOptions<Division>;
