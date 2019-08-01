import { useTranslation } from 'react-i18next';
import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { message } from 'antd';

import { GET_ATTACHMENTS, UPDATE_ATTACHMENTS } from '@leaa/common/graphqls';
import { IAttachmentParams } from '@leaa/common/interfaces';

import { Attachment } from '@leaa/common/entrys';
import { langUtil } from '@leaa/dashboard/utils';
import { AttachmentsArgs, AttachmentsWithPaginationObject, UpdateAttachmentsInput } from '@leaa/common/dtos/attachment';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { FormCard } from '@leaa/dashboard/components/FormCard';

import { AttachmentList } from './_components/AttachmentList/AttachmentList';
import { AttachmentDropzone } from './_components/AttachmentDropzone/AttachmentDropzone';

import style from './style.less';

interface IProps {
  value?: number | undefined;
  onChange?: (checked: boolean) => void;
  attachmentParams: IAttachmentParams;
  onSubmitCallback?: (v: any) => void;
  disableMessage?: boolean;
}

export const AttachmentBox = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t, i18n } = useTranslation();

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
      onError: e => message.error(e.message),
      onCompleted: () =>
        !props.disableMessage &&
        message.success(
          `${langUtil.removeSpace(`${t('_lang:attachment')} ${t('_lang:updatedSuccessfully')}`, i18n.language)}`,
        ),
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
    attachments.map(a => ({
      uuid: a.uuid,
      title: a.title,
      link: a.link,
      sort: Number(a.sort),
      status: Number(a.status),
    }));

  // from children onChangeAttachmentsCallback
  const onChangeAttachments = async (attachments: Attachment[]) => {
    if (attachments && attachments.length > 0) {
      await setSubmitVariables({ attachments: pickAttachments(attachments) });
      await updateAttachmentsMutate();
    }
  };

  // from parent
  const onUpdateAttachments = async () => {
    if (attachmentListRef.current.attachments && attachmentListRef.current.attachments.length > 0) {
      await setSubmitVariables({ attachments: pickAttachments(attachmentListRef.current.attachments) });
      await updateAttachmentsMutate();
    }
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
      {updateAttachmentsMutation.error ? <ErrorCard error={updateAttachmentsMutation.error} /> : null}

      <FormCard
        title={
          <span>
            {langUtil.removeSpace(`${t('_lang:attachment')} ${t('_lang:list')}`, i18n.language)}
            <code className={style['title-code']}>
              {props.attachmentParams.type} / {props.attachmentParams.module_name}, {props.attachmentParams.module_id},{' '}
              {props.attachmentParams.module_type}
            </code>
          </span>
        }
      >
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
          onDeleteAttachmentCallback={refreshAttachments}
        />
      </FormCard>
    </div>
  );
});
