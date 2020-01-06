import { FindOneOptions } from 'typeorm';
import { ZansArgs, ZanArgs } from '@leaa/common/src/dtos/zan';
import { Zan } from '@leaa/common/src/entrys';

export type IZansArgs = ZansArgs & FindOneOptions<Zan>;
export type IZanArgs = ZanArgs & FindOneOptions<Zan>;
