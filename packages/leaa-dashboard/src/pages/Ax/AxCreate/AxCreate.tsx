import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

import { Ax } from '@leaa/api/src/entrys';
import { CREATE_BUTTON_ICON } from '@leaa/dashboard/src/constants';
import { AxCreateOneReq } from '@leaa/api/src/dtos/ax';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { msg, errorMsg, ajax } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, SubmitBar } from '@leaa/dashboard/src/components';

import { AxInfoForm } from '../_components/AxInfoForm/AxInfoForm';

import style from './style.module.less';

const API_PATH = 'axs';

export default (props: IPage) => {
  const { t } = useTranslation();

  const infoFormRef = useRef<ICommenFormRef<AxCreateOneReq>>(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  const onCreateItem = async () => {
    const infoData: ISubmitData<AxCreateOneReq> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const data: ISubmitData<AxCreateOneReq> = {
      ...infoData,
    };

    setSubmitLoading(true);

    ajax
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, data)
      .then((res: IHttpRes<Ax>) => {
        msg(t('_lang:createdSuccessfully'));

        props.history.push(`/${API_PATH}/${res.data.data?.id}`);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));
  };

  return (
    <PageCard route={props.route} title="@CREATE" className={style['wapper']} loading={submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <AxInfoForm ref={infoFormRef} />

      <SubmitBar full>
        <Button
          type="primary"
          size="large"
          icon={CREATE_BUTTON_ICON}
          className="g-submit-bar-button"
          loading={submitLoading}
          onClick={onCreateItem}
        >
          {t('_lang:create')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
