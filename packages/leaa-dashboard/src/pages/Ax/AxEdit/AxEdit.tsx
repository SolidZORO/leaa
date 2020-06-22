import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Row, Col } from 'antd';

import { Ax, Attachment } from '@leaa/api/src/entrys';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { AxUpdateOneReq } from '@leaa/api/src/dtos/ax';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg, ajax } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, Rcon, SubmitBar, AttachmentBox } from '@leaa/dashboard/src/components';

import { AxInfoForm } from '../_components/AxInfoForm/AxInfoForm';

import style from './style.module.less';

const API_PATH = 'axs';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<AxUpdateOneReq>>(null);

  const [item, setItem] = useState<Ax | undefined>();
  const [itemLoading, setItemLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const onFetchItem = () => {
    setItemLoading(true);

    ajax
      .get(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`)
      .then((res: IHttpRes<Ax>) => {
        setItem(res.data.data);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setItemLoading(false));
  };

  const onUpdateItem = async () => {
    const infoData: ISubmitData<AxUpdateOneReq> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const data: ISubmitData<AxUpdateOneReq> = {
      ...infoData,
    };

    setSubmitLoading(true);

    ajax
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`, data)
      .then((res: IHttpRes<Ax>) => {
        setItem(res.data.data);

        msg(t('_lang:updatedSuccessfully'));
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onFetchItem(), []);

  return (
    <PageCard route={props.route} title="@EDIT" className={style['wapper']} loading={itemLoading || submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <AxInfoForm item={item} loading={itemLoading} ref={infoFormRef} />

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <AttachmentBox
            type="list"
            title={t('_lang:galleryMb')}
            listHeight={350}
            attachmentParams={{
              type: 'image',
              moduleId: item?.id,
              moduleName: 'ax',
              typeName: 'gallery',
              typePlatform: 'mb',
            }}
          />
        </Col>

        <Col xs={24} sm={12}>
          <AttachmentBox
            type="list"
            title={t('_lang:galleryPc')}
            listHeight={350}
            attachmentParams={{
              type: 'image',
              moduleId: item?.id,
              moduleName: 'ax',
              typeName: 'gallery',
              typePlatform: 'pc',
            }}
          />
        </Col>
      </Row>

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={<Rcon type={UPDATE_BUTTON_ICON} />}
          className="g-submit-bar-button"
          loading={submitLoading}
          onClick={onUpdateItem}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
