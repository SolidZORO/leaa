import _ from 'lodash';
import React, { forwardRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { authUtil } from '@leaa/dashboard/utils';
import axios from 'axios';
import { message } from 'antd';
import { CreateAttachmentInput } from '@leaa/common/dtos/attachment';

import { AttachmentDropzone } from './_components/AttachmentDropzone/AttachmentDropzone';
import { AttachmentList } from './_components/AttachmentList/AttachmentList';

import style from './style.less';

interface IProps {
  value?: number | undefined;
  onChange?: (checked: boolean) => void;
  attachmentParams: Pick<
    CreateAttachmentInput,
    'type' | 'userId' | 'moduleId' | 'moduleName' | 'moduleType' | 'userId'
  >;
}

export const AttachmentBox = (props: IProps) => {
  return (
    <>
      <AttachmentDropzone attachmentParams={{ ...props.attachmentParams }} />
      <AttachmentList />
    </>
  );
};
