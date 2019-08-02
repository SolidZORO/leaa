// import { CreateAttachmentInput } from '@leaa/common/dtos/attachment';
import { Attachment } from '@leaa/common/entrys';

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

// export type IAttachmentParams = Pick<
//   CreateAttachmentInput,
//   'type' | 'user_id' | 'moduleId' | 'moduleName' | 'moduleType'
// >;

export interface IAttachmentParams {
  type: string;
  moduleId: number;
  moduleName: string;
  moduleType: string;
}

export type IAttachmentDbFilterField = Partial<Pick<Attachment, 'module_name' | 'module_id' | 'module_type'>>;

export type IAttachmentDbCreateField = Pick<
  Attachment,
  | 'uuid'
  | 'title'
  | 'alt'
  | 'type'
  | 'filename'
  | 'module_name'
  | 'module_id'
  | 'module_type'
  | 'ext'
  | 'width'
  | 'height'
  | 'path'
  | 'size'
  | 'at2x'
  | 'sort'
>;

export type IAttachmentDbUpdateField = Pick<Attachment, 'title' | 'alt' | 'link' | 'sort' | 'status'>;

export interface IAttachmentBoxRef {
  onUpdateAttachments: () => void;
  onChangeAttachments: (attachments: Attachment[]) => void;
}
