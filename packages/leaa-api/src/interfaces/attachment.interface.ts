import { FindOneOptions } from 'typeorm';
import { AttachmentGetManyReq, AttachmentGetOneReq } from '@leaa/common/src/dtos/attachment';
import { Attachment } from '@leaa/common/src/entrys';

export type IAttachmentsArgs = AttachmentGetManyReq & FindOneOptions<Attachment>;
export type IAttachmentArgs = AttachmentGetOneReq & FindOneOptions<Attachment>;
