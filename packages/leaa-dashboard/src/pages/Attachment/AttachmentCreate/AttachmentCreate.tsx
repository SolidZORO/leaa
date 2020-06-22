import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Attachment } from '@leaa/api/src/entrys';
import { AttachmentCreateOneReq } from '@leaa/api/src/dtos/attachment';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg, ajax } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta } from '@leaa/dashboard/src/components';

import style from './style.module.less';

const API_PATH = 'attachments';

export default (props: IPage) => {
  const { t } = useTranslation();

  const infoFormRef = useRef<ICommenFormRef<AttachmentCreateOneReq>>(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  const onCreateItem = async () => {
    const infoData: ISubmitData<AttachmentCreateOneReq> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const data: ISubmitData<AttachmentCreateOneReq> = {
      ...infoData,
    };

    setSubmitLoading(true);

    ajax
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, data)
      .then((res: IHttpRes<Attachment>) => {
        msg(t('_lang:createdSuccessfully'));

        props.history.push(`/${API_PATH}/${res.data.data?.id}`);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));
  };

  return (
    <PageCard route={props.route} title="@CREATE" className={style['wapper']} loading={submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />
    </PageCard>
  );
};
