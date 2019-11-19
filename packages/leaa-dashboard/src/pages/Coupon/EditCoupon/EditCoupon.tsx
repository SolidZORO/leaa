import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message, Row, Col } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Ax } from '@leaa/common/src/entrys';
import { IAttachmentBoxRef } from '@leaa/common/src/interfaces';
import { GET_AX, UPDATE_AX } from '@leaa/common/src/graphqls';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { AxArgs, UpdateAxInput } from '@leaa/common/src/dtos/ax';
import { IPage } from '@leaa/dashboard/src/interfaces';

import { HtmlMeta, PageCard, ErrorCard, SubmitBar, AttachmentBox } from '@leaa/dashboard/src/components';

import { CouponInfoForm } from '../_components/CouponInfoForm/CouponInfoForm';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };
  const listHeight = 600;

  // ref
  const [axInfoFormRef, setAxInfoFormRef] = useState<any>();
  const getBannerMbRef = useRef<IAttachmentBoxRef>(null);
  const getBannerPcRef = useRef<IAttachmentBoxRef>(null);
  const getGalleryMbRef = useRef<IAttachmentBoxRef>(null);
  const getGalleryPcRef = useRef<IAttachmentBoxRef>(null);

  // query
  const getAxVariables = { id: Number(id) };
  const getAxQuery = useQuery<{ ax: Ax }, AxArgs>(GET_AX, {
    variables: getAxVariables,
    fetchPolicy: 'network-only',
  });

  // mutation
  const [submitVariables, setSubmitVariables] = useState<{ id: number; ax: UpdateAxInput }>();
  const [updateAxMutate, updateAxMutation] = useMutation<Ax>(UPDATE_AX, {
    variables: submitVariables,
    onCompleted: () => message.success(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_AX, variables: getAxVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateAxInput = {};

    axInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: Ax) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);

        return;
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

  const layoutCol = { xs: 24, md: 12 };

  return (
    <PageCard
      title={t(`${props.route.namei18n}`)}
      className={style['wapper']}
      loading={getAxQuery.loading || updateAxMutation.loading}
    >
      <HtmlMeta title={t(`${props.route.namei18n}`)} />

      {getAxQuery.error ? <ErrorCard error={getAxQuery.error} /> : null}
      {updateAxMutation.error ? <ErrorCard error={updateAxMutation.error} /> : null}

      <CouponInfoForm
        item={getAxQuery.data && getAxQuery.data.ax}
        loading={getAxQuery.loading}
        wrappedComponentRef={(inst: unknown) => setAxInfoFormRef(inst)}
      />

      <Row gutter={16}>
        <Col {...layoutCol}>
          <AttachmentBox
            disableMessage
            ref={getBannerMbRef}
            attachmentParams={{ type: 'image', moduleId: Number(id), moduleName: 'ax', moduleType: 'banner_mb' }}
            listHeight={listHeight}
          />
        </Col>

        <Col {...layoutCol}>
          <AttachmentBox
            disableMessage
            ref={getBannerPcRef}
            attachmentParams={{ type: 'image', moduleId: Number(id), moduleName: 'ax', moduleType: 'banner_pc' }}
            listHeight={listHeight}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col {...layoutCol}>
          <AttachmentBox
            disableMessage
            ref={getGalleryMbRef}
            attachmentParams={{ type: 'image', moduleId: Number(id), moduleName: 'ax', moduleType: 'gallery_mb' }}
            listHeight={listHeight}
          />
        </Col>

        <Col {...layoutCol}>
          <AttachmentBox
            disableMessage
            ref={getGalleryPcRef}
            attachmentParams={{ type: 'image', moduleId: Number(id), moduleName: 'ax', moduleType: 'gallery_pc' }}
            listHeight={listHeight}
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
