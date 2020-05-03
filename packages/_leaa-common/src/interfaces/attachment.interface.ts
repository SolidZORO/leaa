// import { CreateAttachmentInput } from '@leaa/common/src/dtos/attachment';
import { Attachment } from '@leaa/common/src/entrys';

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
//   'type' | 'user_id' | 'moduleId' | 'moduleName' | 'typeName'
// >;

export interface IAttachmentParams {
  type: string;
  moduleId?: string;
  moduleName: string;
  typeName: string;
  typePlatform?: string;
}

export type IAttachmentDbFilterField = Partial<
  Pick<Attachment, 'module_name' | 'module_id' | 'type_name' | 'type_platform'>
>;

export type IAttachmentCreateFieldByLocal = Pick<
  Attachment,
  | 'uuid'
  | 'title'
  | 'alt'
  | 'type'
  | 'filename'
  | 'module_name'
  | 'module_id'
  | 'type_name'
  | 'type_platform'
  | 'ext'
  | 'width'
  | 'height'
  | 'path'
  | 'size'
  | 'at2x'
  | 'sort'
  | 'in_local'
>;

export interface IAttachmentCreateFieldByOss extends IAttachmentCreateFieldByLocal {
  in_oss: number;
}

export type IAttachmentDbUpdateField = Pick<Attachment, 'title' | 'alt' | 'link' | 'sort' | 'status'>;

export interface IAttachmentBoxRef {
  onUpdateAttachments: () => void;
  onChangeAttachments: (attachments: Attachment[]) => void;
}

//

export interface ISaveInOssSignature {
  OSSAccessKeyId: string;
  expiration: string;
  policy: string;
  saveDirPath: string;
  signature: string;
  uploadEndPoint: string;
  // callback: string;
  callback: any;
  saveIn: 'oss';
}

export interface ISaveInLocalSignature extends Pick<ISaveInOssSignature, 'uploadEndPoint' | 'saveDirPath'> {
  saveIn: 'local';
}

export interface ICraeteAttachmentByOssCallback {
  object: string;
  bucket: string;
  size: string;
  etag: string;
  height: string;
  width: string;
  mimeType: string;
  format: string;
  originalname: string;
  type: string;
  moduleId: string;
  moduleName: string;
  typeName: string;
  typePlatform: string;
}
