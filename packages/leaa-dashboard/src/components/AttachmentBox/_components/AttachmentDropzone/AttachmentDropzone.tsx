import cx from 'classnames';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { attachmentUtil } from '@leaa/dashboard/src/utils';

import { Attachment } from '@leaa/common/src/entrys';
import { IAttachmentParams } from '@leaa/common/src/interfaces';
import { Rcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  value?: number | undefined;
  attachmentParams?: IAttachmentParams;
  onUploadedCallback?: (uploaded: number) => void;
  type?: 'list' | 'card';
  cardHeight?: number;
  attachments?: Attachment[];
  circle?: boolean;
}

export const AttachmentDropzone = (props: IProps) => {
  const cardHeight = (props.type === 'card' && props.cardHeight) || undefined;

  const onUploadFileList = async (fileList: File[]) => {
    const signature = await attachmentUtil.getSignature();

    fileList.forEach((file: File) =>
      attachmentUtil.uploadFile(file, signature, props.attachmentParams, {
        onUploadSuccess: e => props.onUploadedCallback && props.onUploadedCallback(e),
      }),
    );
  };

  const onDrop = useCallback(async acceptedFiles => onUploadFileList(acceptedFiles), []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });
  const dropTipsDom = <Rcon type="ri-x-add-line" className={style['file-icon']} style={{ height: cardHeight }} />;
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
      {isDragActive ? dropTipsDom : dropTipsDom}
    </div>
  );
};
