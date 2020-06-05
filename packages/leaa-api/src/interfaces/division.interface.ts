import { FindOneOptions } from 'typeorm';
import { DivisionGetManyReq, DivisionGetOneReq } from '@leaa/api/src/dtos/division';
import { Division } from '@leaa/api/src/entrys';

export type IDivisionsArgs = DivisionGetManyReq & FindOneOptions<Division>;
export type IDivisionArgs = DivisionGetOneReq & FindOneOptions<Division>;

export type IDivisionSource = { code: string; name: string; provinceCode: string; cityCode: string };
export type IDivisionDist = { value: string; children: IDivisionDist[]; name?: string };
