import React, { useState, forwardRef } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_ATTACHMENTS } from '@leaa/common/graphqls';
import { IAttachmentParams } from '@leaa/common/interfaces';

import { Attachment } from '@leaa/common/entrys';
import { AttachmentsArgs, AttachmentsObject } from '@leaa/common/dtos/attachment';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';

import { AttachmentList } from './_components/AttachmentList/AttachmentList';
import { AttachmentDropzone } from './_components/AttachmentDropzone/AttachmentDropzone';

import style from './style.less';

interface IProps {
  value?: number | undefined;
  onChange?: (checked: boolean) => void;
  attachmentParams: IAttachmentParams;
  onSubmitCallback?: (v: any) => void;
}

export const AttachmentBox = forwardRef<HTMLDivElement, IProps>((props: IProps, ref: React.Ref<any>) => {
  const [getAttachmentsVariables, setgetAttachmentsVariables] = useState<AttachmentsArgs>({
    ...props.attachmentParams,
  });

  const getAttachmentsQuery = useQuery<{ attachments: AttachmentsObject }, AttachmentsArgs>(GET_ATTACHMENTS, {
    variables: getAttachmentsVariables,
  });

  const refreshAttachments = () => {
    // TODO here can save prev AttachmentList and then refresh
    // <code...>

    setgetAttachmentsVariables({
      ...props.attachmentParams,
      refreshHash: new Date().getMilliseconds(),
    });
  };

  const onChangeAttachments = (attachments: Attachment[]) => {
    console.log('ALL ====>', attachments);
  };

  return (
    <div className={style['wrapper']}>
      {getAttachmentsQuery.error ? <ErrorCard error={getAttachmentsQuery.error} /> : null}
      <AttachmentDropzone attachmentParams={{ ...props.attachmentParams }} onUploadedCallback={refreshAttachments} />
      <AttachmentList
        ref={ref}
        attachmentParams={{ ...props.attachmentParams }}
        attachments={
          getAttachmentsQuery &&
          getAttachmentsQuery.data &&
          getAttachmentsQuery.data.attachments &&
          getAttachmentsQuery.data.attachments.items
        }
        onChangeAttachmentsCallback={onChangeAttachments}
      />
    </div>
  );
});
