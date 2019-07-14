import _ from 'lodash';
import React, { forwardRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { authUtil } from '@leaa/dashboard/utils';
import axios from 'axios';
import { message } from 'antd';
import { CreateAttachmentInput } from '@leaa/common/dtos/attachment';

import style from './style.less';

interface IProps {
  value?: number | undefined;
  onChange?: (checked: boolean) => void;
  attachmentParams: Pick<
    CreateAttachmentInput,
    'type' | 'userId' | 'moduleId' | 'moduleName' | 'moduleType' | 'userId'
  >;
}

export const AttachmentDropzone = (props: IProps) => {
  const onDrop = useCallback(acceptedFiles => {
    const token = authUtil.getAuthToken();

    acceptedFiles.forEach((file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      _.map(props.attachmentParams, (v, k) => formData.append(`${k}`, `${v}`));

      axios
        .post(`${process.env.UPLOAD_ENDPOINT}`, formData, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        })
        .then(e => {
          console.log(e);
          message.success('OK');
        })
        .catch((e: Error) => {
          message.info(e.message);
        });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <div {...getRootProps()} className={style['wrapper']}>
      <input {...getInputProps()} className={style['file-input']} />
      {isDragActive ? <p>Drop the files here ...</p> : <p>Drag drop some files here, or click to select files</p>}
    </div>
  );
};
