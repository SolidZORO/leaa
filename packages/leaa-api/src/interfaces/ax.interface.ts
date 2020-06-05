import { FindOneOptions } from 'typeorm';
import { AxGetManyReq, AxGetOneReq } from '@leaa/api/src/dtos/ax';
import { Ax, Attachment } from '@leaa/api/src/entrys';

export type IAxsArgs = AxGetManyReq & FindOneOptions<Ax>;
export type IAxArgs = AxGetOneReq & FindOneOptions<Ax>;

export interface IAxAttachments {
  bannerMbList: Attachment[];
  bannerPcList: Attachment[];
  //
  galleryMbList: Attachment[];
  galleryPcList: Attachment[];
}
