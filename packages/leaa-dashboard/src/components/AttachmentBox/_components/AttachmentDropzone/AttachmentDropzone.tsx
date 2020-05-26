import cx from 'classnames';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';

import { uploadFile, getUploadSignature } from '@leaa/dashboard/src/utils';
import { Attachment } from '@leaa/common/src/entrys';
import { IAttachmentParams } from '@leaa/common/src/interfaces';
import { IHttpRes } from '@leaa/dashboard/src/interfaces';

import style from './style.module.less';

interface IProps {
  value?: number | undefined;
  attachmentParams?: IAttachmentParams;
  onDropzoneAttasCallback?: (attachment: Attachment[]) => void;
  type?: 'list' | 'card';
  cardHeight?: number;
  attachments?: Attachment[];
  circle?: boolean;
}

export const AttachmentDropzone = (props: IProps) => {
  const cardHeight = (props.type === 'card' && props.cardHeight) || undefined;

  const onUploadFileList = async (fileList: File[]) => {
    const signature = await getUploadSignature();

    if (!signature) return;

    const uploadeds: Attachment[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const file of fileList) {
      // eslint-disable-next-line no-await-in-loop
      await uploadFile(file, {
        signature,
        attachmentParams: props.attachmentParams,
        ignoreMsg: true,
        onCallback: {
          onUploadSuccess: (res: IHttpRes<Attachment>) => uploadeds.push(res.data.data),
        },
      });
    }

    if (props.onDropzoneAttasCallback) await props.onDropzoneAttasCallback(uploadeds);
  };

  const onDrop = useCallback(async (acceptedFiles) => onUploadFileList(acceptedFiles), [props.attachments]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });
  const isEmpty = props.attachments && props.attachments.length === 0;

  return (
    <div
      {...getRootProps()}
      className={cx(style['attachment-dropzone-wrapper'], {
        [style['wrapper-drop--list']]: props.type === 'list',
        [style['wrapper-drop--card']]: props.type === 'card',
        [style['wrapper-drop--circle']]: props.circle,
        [style['wrapper-drop--empty']]: isEmpty,
        'g-wrapper-drop--empty': isEmpty,
      })}
      style={{ height: cardHeight }}
    >
      <input {...getInputProps()} className={style['file-input']} />
      <PlusOutlined className={style['file-icon']} style={{ height: cardHeight }} />
    </div>
  );
};
