import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Role } from '@leaa/api/src/entrys';
import { RoleUpdateOneReq } from '@leaa/api/src/dtos/role';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes, IHttpError } from '@leaa/dashboard/src/interfaces';
import { fetcher } from '@leaa/dashboard/src/libs';
import { msg, errorMsg } from '@leaa/dashboard/src/utils';

import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { RoleInfoForm } from '../_components/RoleInfoForm/RoleInfoForm';

import style from './style.module.less';

const API_PATH = 'roles';

export default (props: IPage) => {
  const { t } = useTranslation();

  const infoFormRef = useRef<ICommenFormRef<RoleUpdateOneReq>>(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  const onCreateItem = async () => {
    const infoData: ISubmitData<RoleUpdateOneReq> = await infoFormRef.current?.onValidateForm();

    if (!infoData) return;

    const data: ISubmitData<RoleUpdateOneReq> = {
      ...infoData,
    };

    setSubmitLoading(true);

    fetcher
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, data)
      .then((res: IHttpRes<Role>) => {
        msg(t('_lang:createdSuccessfully'));

        props.history.push(`/${API_PATH}/${res.data.data?.id}`);
      })
      .catch((err: IHttpError) => errorMsg(err.response?.data?.message || err.message))
      .finally(() => setSubmitLoading(false));
  };

  return (
    <PageCard route={props.route} title="@CREATE" className={style['wapper']} loading={submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <RoleInfoForm ref={infoFormRef} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@CREATE', loading: submitLoading }}
        simpleButtonAction={onCreateItem}
      />
    </PageCard>
  );
};
