import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'antd';

import { Ax } from '@leaa/api/src/entrys';
import { AxUpdateOneReq } from '@leaa/api/src/dtos/ax';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { fetcher } from '@leaa/dashboard/src/libs';
import { msg, errorMsg } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, AttachmentBox, SubmitToolbar } from '@leaa/dashboard/src/components';

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

    fetcher
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

    fetcher
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
    <PageCard route={props.route} title="@UPDATE" className={style['wapper']} loading={itemLoading || submitLoading}>
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

      <SubmitToolbar
        simpleButtonGroup={{ title: '@UPDATE', loading: submitLoading }}
        simpleButtonAction={onUpdateItem}
      />
    </PageCard>
  );
};
