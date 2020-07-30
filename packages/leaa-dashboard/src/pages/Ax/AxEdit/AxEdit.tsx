import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'antd';

import { Ax } from '@leaa/api/src/entrys';
import { AxUpdateOneReq } from '@leaa/api/src/dtos/ax';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IFetchRes } from '@leaa/dashboard/src/interfaces';
import { envConfig } from '@leaa/dashboard/src/configs';
import { fetcher, useSWR } from '@leaa/dashboard/src/libs';
import { msg, httpErrorMsg } from '@leaa/dashboard/src/utils';

import { PageCard, HtmlMeta, AttachmentBox, SubmitToolbar } from '@leaa/dashboard/src/components';

import { AxInfoForm } from '../_components/AxInfoForm/AxInfoForm';

import style from './style.module.less';

const API_PATH = 'axs';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  const infoFormRef = useRef<ICommenFormRef<AxUpdateOneReq>>(null);

  const item = useSWR<IFetchRes<Ax>>(
    { url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}` },
    { onError: httpErrorMsg },
  );

  const [submitLoading, setSubmitLoading] = useState(false);

  const onUpdateItem = async () => {
    if (submitLoading) return;

    const data: ISubmitData<AxUpdateOneReq> = await infoFormRef.current?.onValidateForm();
    if (!data) return;

    setSubmitLoading(true);

    fetcher
      .patch(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}/${id}`, data)
      .then((res: IHttpRes<Ax>) => {
        item.mutate(res, false);

        msg(t('_lang:updatedSuccessfully'));
      })
      .catch(httpErrorMsg)
      .finally(() => setSubmitLoading(false));
  };

  return (
    <PageCard
      route={props.route}
      title="@UPDATE"
      className={style['page-card-wapper']}
      loading={item.loading || submitLoading}
    >
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <AxInfoForm item={item?.data?.data} loading={item.loading} ref={infoFormRef} />

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <AttachmentBox
            type="list"
            title={t('_lang:galleryMb')}
            listHeight={350}
            attachmentParams={{
              type: 'image',
              moduleId: item?.data?.data.id,
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
              moduleId: item?.data?.data.id,
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
