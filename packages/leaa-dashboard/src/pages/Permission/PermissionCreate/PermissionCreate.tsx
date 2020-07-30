import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Permission } from '@leaa/api/src/entrys';
import { PermissionUpdateOneReq } from '@leaa/api/src/dtos/permission';
import { IPage, ICommenFormRef, ISubmitData, IHttpRes } from '@leaa/dashboard/src/interfaces';
import { fetcher } from '@leaa/dashboard/src/libs';
import { msg, httpErrorMsg } from '@leaa/dashboard/src/utils';
import { envConfig } from '@leaa/dashboard/src/configs';
import { PageCard, HtmlMeta, SubmitToolbar } from '@leaa/dashboard/src/components';

import { PermissionInfoForm } from '../_components/PermissionInfoForm/PermissionInfoForm';

import style from './style.module.less';

const API_PATH = 'permissions';

export default (props: IPage) => {
  const { t } = useTranslation();
  const infoFormRef = useRef<ICommenFormRef<PermissionUpdateOneReq>>(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const onCreateItem = async () => {
    const infoData: ISubmitData<PermissionUpdateOneReq> = await infoFormRef.current?.onValidateForm();
    if (!infoData) return;

    const data: ISubmitData<PermissionUpdateOneReq> = infoData;
    setSubmitLoading(true);

    fetcher
      .post(`${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`, data)
      .then((res: IHttpRes<Permission>) => {
        msg(t('_lang:createdSuccessfully'));

        props.history.push(`/${API_PATH}/${res.data.data?.id}`);
      })
      .catch(httpErrorMsg)
      .finally(() => setSubmitLoading(false));
  };

  return (
    <PageCard route={props.route} title="@CREATE" className={style['page-card-wapper']} loading={submitLoading}>
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <PermissionInfoForm ref={infoFormRef} />

      <SubmitToolbar
        simpleButtonGroup={{ title: '@CREATE', loading: submitLoading }}
        simpleButtonAction={onCreateItem}
      />
    </PageCard>
  );
};
