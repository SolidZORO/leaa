import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message, Row, Col } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Ax } from '@leaa/common/entrys';
import { IAttachmentBoxRef } from '@leaa/common/interfaces';
import { GET_AX, UPDATE_AX, GET_ATTACHMENTS } from '@leaa/common/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/constants';
import { AxArgs, UpdateAxInput } from '@leaa/common/dtos/ax';
import { IPage } from '@leaa/dashboard/interfaces';
import { AttachmentsWithPaginationObject, AttachmentsArgs } from '@leaa/common/dtos/attachment';
import { AttachmentBox } from '@leaa/dashboard/components/AttachmentBox';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';

import { AxInfoForm } from '../_components/AxInfoForm/AxInfoForm';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  let axInfoFormRef: any;

  const getAxVariables = { id: Number(id) };
  const getAxQuery = useQuery<{ ax: Ax }, AxArgs>(GET_AX, {
    variables: getAxVariables,
  });

  const baseAttachmentVariables: AttachmentsArgs = {
    moduleName: 'ax',
    moduleId: Number(id),
    orderSort: 'ASC',
    orderBy: 'createdAt',
  };

  const getBannerMbRef = useRef<IAttachmentBoxRef>(null);
  const getBannerMbVariables = { ...baseAttachmentVariables, moduleType: 'banner_mb', refreshHash: 0 };
  const getBannerMbQuery = useQuery<{ attachments: AttachmentsWithPaginationObject }, AttachmentsArgs>(
    GET_ATTACHMENTS,
    { variables: getBannerMbVariables },
  );

  const getBannerPcRef = useRef<IAttachmentBoxRef>(null);
  const getBannerPcVariables = { ...baseAttachmentVariables, moduleType: 'banner_pc', refreshHash: 0 };
  const getBannerPcQuery = useQuery<{ attachments: AttachmentsWithPaginationObject }, AttachmentsArgs>(
    GET_ATTACHMENTS,
    { variables: getBannerPcVariables },
  );

  //

  const getGalleryMbRef = useRef<IAttachmentBoxRef>(null);
  const getGalleryMbVariables = { ...baseAttachmentVariables, moduleType: 'gallery_mb', refreshHash: 0 };
  const getGalleryMbQuery = useQuery<{ attachments: AttachmentsWithPaginationObject }, AttachmentsArgs>(
    GET_ATTACHMENTS,
    { variables: getGalleryMbVariables },
  );

  const getGalleryPcRef = useRef<IAttachmentBoxRef>(null);
  const getGalleryPcVariables = { ...baseAttachmentVariables, moduleType: 'gallery_pc', refreshHash: 0 };
  const getGalleryPcQuery = useQuery<{ attachments: AttachmentsWithPaginationObject }, AttachmentsArgs>(
    GET_ATTACHMENTS,
    { variables: getGalleryPcVariables },
  );

  const [submitVariables, setSubmitVariables] = useState<{ id: number; ax: UpdateAxInput }>();
  const [updateAxMutate, updateAxMutation] = useMutation<Ax>(UPDATE_AX, {
    variables: submitVariables,
    onCompleted: () => message.success(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [
      { query: GET_AX, variables: getAxVariables },
      { query: GET_ATTACHMENTS, variables: getBannerMbVariables },
      { query: GET_ATTACHMENTS, variables: getBannerPcVariables },
    ],
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

      if (getBannerMbRef && getBannerMbRef.current) {
        getBannerMbRef.current.onUpdateAttachments();
      }

      if (getBannerPcRef && getBannerPcRef.current) {
        getBannerPcRef.current.onUpdateAttachments();
      }

      if (getGalleryMbRef && getGalleryMbRef.current) {
        getGalleryMbRef.current.onUpdateAttachments();
      }

      if (getGalleryPcRef && getGalleryPcRef.current) {
        getGalleryPcRef.current.onUpdateAttachments();
      }
    });
  };

  return (
    <PageCard
      title={t(`${props.route.namei18n}`)}
      className={style['wapper']}
      loading={getAxQuery.loading || updateAxMutation.loading}
    >
      {getAxQuery.error ? <ErrorCard error={getAxQuery.error} /> : null}
      {getBannerMbQuery.error ? <ErrorCard error={getBannerMbQuery.error} /> : null}
      {getBannerPcQuery.error ? <ErrorCard error={getBannerPcQuery.error} /> : null}
      {getGalleryMbQuery.error ? <ErrorCard error={getGalleryMbQuery.error} /> : null}
      {getGalleryPcQuery.error ? <ErrorCard error={getGalleryPcQuery.error} /> : null}
      {updateAxMutation.error ? <ErrorCard error={updateAxMutation.error} /> : null}

      <AxInfoForm
        item={getAxQuery.data && getAxQuery.data.ax}
        loading={getAxQuery.loading}
        wrappedComponentRef={(inst: unknown) => {
          axInfoFormRef = inst;
        }}
      />

      <Row gutter={16}>
        <Col xs={12}>
          <AttachmentBox
            disableMessage
            ref={getBannerMbRef}
            attachmentParams={{ type: 'image', moduleId: Number(id), moduleName: 'ax', moduleType: 'banner_mb' }}
          />
        </Col>

        <Col xs={12}>
          <AttachmentBox
            disableMessage
            ref={getBannerPcRef}
            attachmentParams={{ type: 'image', moduleId: Number(id), moduleName: 'ax', moduleType: 'banner_pc' }}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={12}>
          <AttachmentBox
            disableMessage
            ref={getGalleryMbRef}
            attachmentParams={{ type: 'image', moduleId: Number(id), moduleName: 'ax', moduleType: 'gallery_mb' }}
          />
        </Col>

        <Col xs={12}>
          <AttachmentBox
            disableMessage
            ref={getGalleryPcRef}
            attachmentParams={{ type: 'image', moduleId: Number(id), moduleName: 'ax', moduleType: 'gallery_pc' }}
          />
        </Col>
      </Row>

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
