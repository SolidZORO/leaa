import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_ATTACHMENTS } from '@leaa/common/graphqls';
import { IAttachmentParams } from '@leaa/common/interfaces';
import { AttachmentsArgs, AttachmentsObject } from '@leaa/common/dtos/attachment';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';

import { AttachmentDropzone } from './_components/AttachmentDropzone/AttachmentDropzone';
import { AttachmentList } from './_components/AttachmentList/AttachmentList';

import style from './style.less';

interface IProps {
  value?: number | undefined;
  onChange?: (checked: boolean) => void;
  attachmentParams: IAttachmentParams;
}

export const AttachmentBox = (props: IProps) => {
  const [getAttachmentsVariables, setgetAttachmentsVariables] = useState<AttachmentsArgs>({
    ...props.attachmentParams,
  });

  const getAttachmentsQuery = useQuery<{ attachments: AttachmentsObject }, AttachmentsArgs>(GET_ATTACHMENTS, {
    variables: getAttachmentsVariables,
  });

  const refreshAttachments = () => {
    setgetAttachmentsVariables({
      ...props.attachmentParams,
      refreshHash: new Date().getMilliseconds(),
    });
  };

  return (
    <div className={style['wrapper']}>
      {getAttachmentsQuery.error ? <ErrorCard error={getAttachmentsQuery.error} /> : null}
      <AttachmentDropzone attachmentParams={{ ...props.attachmentParams }} onUploadedCallback={refreshAttachments} />
      <AttachmentList
        attachmentParams={{ ...props.attachmentParams }}
        attachments={
          getAttachmentsQuery &&
          getAttachmentsQuery.data &&
          getAttachmentsQuery.data.attachments &&
          getAttachmentsQuery.data.attachments.items
        }
      />
    </div>
  );
};
