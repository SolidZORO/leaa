import { useTranslation } from 'react-i18next';
import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { message, Tooltip } from 'antd';

import { GET_ATTACHMENTS, UPDATE_ATTACHMENTS } from '@leaa/common/src/graphqls';
import { IAttachmentParams } from '@leaa/common/src/interfaces';

import { Attachment } from '@leaa/common/src/entrys';
import { langUtil } from '@leaa/dashboard/src/utils';
import {
  AttachmentsArgs,
  AttachmentsWithPaginationObject,
  UpdateAttachmentsInput,
} from '@leaa/common/src/dtos/attachment';

import { ErrorCard, FormCard } from '@leaa/dashboard/src/components';

import { AttachmentList } from './_components/AttachmentList/AttachmentList';
import { AttachmentDropzone } from './_components/AttachmentDropzone/AttachmentDropzone';

import style from './style.module.less';

interface IProps {
  value?: number | undefined;
  onChange?: (checked: boolean) => void;
  attachmentParams: IAttachmentParams;
  onSubmitCallback?: (v: any) => void;
  disableMessage?: boolean;
  listHeight?: number;
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
      fetchPolicy: 'network-only',
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
      orderBy: 'sort',
      orderSort: 'ASC',
      refreshHash: new Date().getMilliseconds(),
    });
  };

  const pickAttachments = (attachments: Attachment[]): UpdateAttachmentsInput[] =>
    attachments.map(a => ({
      uuid: a.uuid,
      title: a.title,
      link: a.link || undefined,
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
          <>
            {langUtil.removeSpace(`${t('_lang:attachment')} ${t('_lang:list')}`, i18n.language)}

            <Tooltip
              title={
                <code className={style['title-code-tooltip']}>
                  {props.attachmentParams.type}-{props.attachmentParams.moduleName}-{/* prettier-ignore */}
                  {props.attachmentParams.moduleType}-{props.attachmentParams.moduleId}
                </code>
              }
              trigger="hover"
            >
              <code className={style['title-code-text']}>{props.attachmentParams.moduleType}</code>
            </Tooltip>
          </>
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
          listHeight={props.listHeight}
        />
      </FormCard>
    </div>
  );
});
