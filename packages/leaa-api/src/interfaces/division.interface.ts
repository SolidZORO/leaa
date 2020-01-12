import { FindOneOptions } from 'typeorm';
import { DivisionsArgs, DivisionArgs } from '@leaa/common/src/dtos/division';
import { Division } from '@leaa/common/src/entrys';

export type IDivisionsArgs = DivisionsArgs & FindOneOptions<Division>;
export type IDivisionArgs = DivisionArgs & FindOneOptions<Division>;
