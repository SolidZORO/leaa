import { CreateAttachmentInput } from '@leaa/common/dtos/attachment';
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

export type IAttachmentParams = Pick<
  CreateAttachmentInput,
  'type' | 'user_id' | 'module_id' | 'module_name' | 'module_type' | 'user_id'
>;

export interface IAttachmentBoxRef {
  onUpdateAttachments: () => void;
  onChangeAttachments: (attachments: Attachment[]) => void;
}
