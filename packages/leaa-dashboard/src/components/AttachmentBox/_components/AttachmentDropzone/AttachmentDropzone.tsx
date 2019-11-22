import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { attachmentUtil } from '@leaa/dashboard/src/utils';
import { Icon } from 'antd';

import { IAttachmentParams } from '@leaa/common/src/interfaces';

import style from './style.module.less';

interface IProps {
  value?: number | undefined;
  attachmentParams: IAttachmentParams;
  onUploadedCallback?: (uploaded: number) => void;
}

export const AttachmentDropzone = (props: IProps) => {
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
  const dropTipsDom = <Icon type="plus" className={style['file-icon']} />;

  return (
    <div {...getRootProps()} className={style['wrapper']}>
      <input {...getInputProps()} className={style['file-input']} />
      {isDragActive ? dropTipsDom : dropTipsDom}
    </div>
  );
};
