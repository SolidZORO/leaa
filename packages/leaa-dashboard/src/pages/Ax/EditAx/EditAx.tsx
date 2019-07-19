import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message, Row, Col } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Ax } from '@leaa/common/entrys';
import { IAttachmentBoxRef } from '@leaa/common/interfaces';
import { GET_AX, UPDATE_AX, GET_ATTACHMENTS, DELETE_ATTACHMENT } from '@leaa/common/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/constants';
import { AxArgs, UpdateAxInput } from '@leaa/common/dtos/ax';
import { IPage } from '@leaa/dashboard/interfaces';
import { AttachmentsWithPaginationObject, AttachmentsArgs } from '@leaa/common/dtos/attachment';
import { AttachmentBox } from '@leaa/dashboard/components/AttachmentBox';
import { langUtil } from '@leaa/dashboard/utils';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';
import { FormCard } from '@leaa/dashboard/components/FormCard';

import { AxInfoForm } from '../_components/AxInfoForm/AxInfoForm';

import style from './style.less';

export default (props: IPage) => {
  const { t, i18n } = useTranslation();
  const { id } = props.match.params as { id: string };

  const attachmentBoxRef = useRef<IAttachmentBoxRef>(null);
  let axInfoFormRef: any;

  const getAxVariables = { id: Number(id) };
  const getAxQuery = useQuery<{ ax: Ax }, AxArgs>(GET_AX, {
    variables: getAxVariables,
  });

  const [getAxEditorAttachmentsVariables, setGetAxEditorAttachmentsVariables] = useState<AttachmentsArgs>({
    moduleName: 'ax',
    moduleType: 'editor',
    moduleId: Number(id),
    orderSort: 'ASC',
    refreshHash: 0,
  });
  const getAxEditorAttachmentsQuery = useQuery<{ attachments: AttachmentsWithPaginationObject }, AttachmentsArgs>(
    GET_ATTACHMENTS,
    { variables: getAxEditorAttachmentsVariables },
  );

  const [submitVariables, setSubmitVariables] = useState<{ id: number; ax: UpdateAxInput }>();
  const [updateAxMutate, updateAxMutation] = useMutation<Ax>(UPDATE_AX, {
    variables: submitVariables,
    onCompleted: () => message.success(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [
      { query: GET_AX, variables: getAxVariables },
      { query: GET_ATTACHMENTS, variables: getAxEditorAttachmentsVariables },
    ],
  });

  const [deleteAttachmentsVariables, setDeleteAttachmentsVariables] = useState<{ uuid: string[] }>();
  const [deleteAttachmentsMutate, deleteAttachmentsMutation] = useMutation<{ uuid: string[] }>(DELETE_ATTACHMENT, {
    variables: deleteAttachmentsVariables,
    onCompleted: () => message.success(t('_lang:deletedSuccessfully')),
    refetchQueries: () => [{ query: GET_ATTACHMENTS, variables: getAxEditorAttachmentsVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateAxInput = {};

    axInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Ax) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);
      }

      submitData = formData;

      await setSubmitVariables({ id: Number(id), ax: submitData });
      await updateAxMutate();

      if (attachmentBoxRef && attachmentBoxRef.current) {
        attachmentBoxRef.current.onUpdateAttachments();
      }
    });
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['wapper']} loading={false}>
      {getAxQuery.error ? <ErrorCard error={getAxQuery.error} /> : null}
      {getAxEditorAttachmentsQuery.error ? <ErrorCard error={getAxEditorAttachmentsQuery.error} /> : null}
      {updateAxMutation.error ? <ErrorCard error={updateAxMutation.error} /> : null}
      {deleteAttachmentsMutation.error ? <ErrorCard error={deleteAttachmentsMutation.error} /> : null}

      <AxInfoForm
        item={getAxQuery.data && getAxQuery.data.ax}
        loading={getAxQuery.loading}
        wrappedComponentRef={(inst: unknown) => {
          axInfoFormRef = inst;
        }}
      />

      <FormCard
        title={`
        ${langUtil.removeSpace(`${t('_lang:upload')} ${t('_lang:attachment')}`, i18n.language)}
        (${t('_lang:banner')})
      `}
      >
        <Row gutter={16}>
          <Col xs={24}>
            <AttachmentBox
              disableMessage
              ref={attachmentBoxRef}
              attachmentParams={{
                type: 'image',
                moduleId: Number(id),
                moduleName: 'ax',
                moduleType: 'banner',
              }}
            />
          </Col>
        </Row>
      </FormCard>

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updateAxMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
