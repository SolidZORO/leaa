import _ from 'lodash';
import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { message } from 'antd';

import { GET_ATTACHMENTS, UPDATE_ATTACHMENTS } from '@leaa/common/graphqls';
import { IAttachmentParams } from '@leaa/common/interfaces';

import { Attachment } from '@leaa/common/entrys';
import { AttachmentsArgs, AttachmentsWithPaginationObject, UpdateAttachmentsInput } from '@leaa/common/dtos/attachment';
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

export const AttachmentBox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const attachmentListRef = useRef<any>(null);

  const [getAttachmentsVariables, setgetAttachmentsVariables] = useState<AttachmentsArgs>({
    ...props.attachmentParams,
    orderBy: 'sort',
    orderSort: 'ASC',
  });

  const getAttachmentsQuery = useQuery<{ attachments: AttachmentsWithPaginationObject }, AttachmentsArgs>(
    GET_ATTACHMENTS,
    {
      variables: getAttachmentsVariables,
    },
  );

  const [submitVariables, setSubmitVariables] = useState<{ attachments: UpdateAttachmentsInput[] }>();
  const [updateAttachmentsMutate, updateAttachmentsMutation] = useMutation<UpdateAttachmentsInput[]>(
    UPDATE_ATTACHMENTS,
    {
      variables: submitVariables,
      onError(e) {
        message.error(e.message);
      },
      onCompleted(e) {
        console.log(e);
      },
      refetchQueries: () => [{ query: GET_ATTACHMENTS, variables: getAttachmentsVariables }],
    },
  );

  const refreshAttachments = () => {
    // TODO here can save prev AttachmentList and then refresh
    // <code...>

    setgetAttachmentsVariables({
      ...props.attachmentParams,
      refreshHash: new Date().getMilliseconds(),
    });
  };

  const pickAttachments = (attachments: Attachment[]): UpdateAttachmentsInput[] =>
    attachments.map(a => _.pick(a, ['uuid', 'title', 'link', 'sort', 'status']));

  // from children onChangeAttachmentsCallback
  const onChangeAttachments = async (attachments: Attachment[]) => {
    await setSubmitVariables({ attachments: pickAttachments(attachments) });
    await updateAttachmentsMutate();
  };

  // from parent
  const onUpdateAttachments = async () => {
    await setSubmitVariables({ attachments: pickAttachments(attachmentListRef.current.attachments) });
    await updateAttachmentsMutate();
  };

  useImperativeHandle<{}, any>(
    ref,
    () => ({
      onUpdateAttachments,
      onChangeAttachments,
    }),
    [],
  );

  return (
    <div className={style['wrapper']}>
      {getAttachmentsQuery.error ? <ErrorCard error={getAttachmentsQuery.error} /> : null}
      {updateAttachmentsMutation.error ? <ErrorCard error={updateAttachmentsMutation.error} /> : null}
      <AttachmentDropzone attachmentParams={{ ...props.attachmentParams }} onUploadedCallback={refreshAttachments} />
      <AttachmentList
        ref={attachmentListRef}
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
