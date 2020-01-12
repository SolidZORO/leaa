import { FindOneOptions } from 'typeorm';
import { AttachmentsArgs, AttachmentArgs } from '@leaa/common/src/dtos/attachment';
import { Attachment } from '@leaa/common/src/entrys';

export type IAttachmentsArgs = AttachmentsArgs & FindOneOptions<Attachment>;
export type IAttachmentArgs = AttachmentArgs & FindOneOptions<Attachment>;
