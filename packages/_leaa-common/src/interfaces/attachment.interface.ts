import { CreateAttachmentInput } from '@leaa/common/dtos/attachment';

export enum IAttachmentType {
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  FILE = 'file',
}

export interface IMediaItem {
  id: string;
  type: string;
  url: string;
}

export type IAttachmentParams = Pick<
  CreateAttachmentInput,
  'type' | 'userId' | 'moduleId' | 'moduleName' | 'moduleType' | 'userId'
>;
